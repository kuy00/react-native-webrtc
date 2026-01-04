import { router } from "expo-router";
import { useCallback, useEffect, useRef } from "react";
import { Alert } from "react-native";
import InCallManager from "react-native-incall-manager";
import {
  mediaDevices,
  MediaStream,
  RTCPeerConnection,
  RTCSessionDescription,
} from "react-native-webrtc";
import { RTCSessionDescriptionInit } from "react-native-webrtc/lib/typescript/RTCSessionDescription";
import useWebSocket from "./useWebSocket";

const useWebRtc = (roomId: string, role: string) => {
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const { sendMessage, lastMessage } = useWebSocket();
  const pendingCandidates = useRef<any[]>([]);

  const init = async () => {
    if (peerConnection.current) return;

    const _peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: process.env.EXPO_PUBLIC_STUN_URL! },
        {
          urls: `${process.env.EXPO_PUBLIC_TURN_URL!}?transport=udp`,
          username: process.env.EXPO_PUBLIC_TURN_USERNAME!,
          credential: process.env.EXPO_PUBLIC_TURN_CREDENTIAL!,
        },
      ],
    });

    const _stream = await mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });
    _stream.getTracks().forEach((t) => _peerConnection.addTrack(t, _stream));

    (_peerConnection as any).onicecandidate = (event: any) => {
      if (!event?.candidate) return;
      sendMessage(
        JSON.stringify({
          type: "webrtc.candidate",
          data: { room_id: roomId, candidate: event.candidate },
        })
      );
    };

    peerConnection.current = _peerConnection;
    stream.current = _stream;

    if (role === "caller") {
      await createOffer();
    }
  };

  const createOffer = async () => {
    const offer = await peerConnection.current?.createOffer();
    await peerConnection.current?.setLocalDescription(offer);
    sendMessage(
      JSON.stringify({
        type: "webrtc.offer",
        data: {
          room_id: roomId,
          offer: offer,
        },
      })
    );
  };

  const createAnswer = async (
    roomId: string,
    offer: RTCSessionDescriptionInit
  ) => {
    await peerConnection.current?.setRemoteDescription(
      new RTCSessionDescription(offer)
    );

    InCallManager.start({ media: "audio" });

    for (const candidate of pendingCandidates.current) {
      await peerConnection.current?.addIceCandidate(candidate);
    }
    pendingCandidates.current = [];

    const answer = await peerConnection.current?.createAnswer();
    await peerConnection.current?.setLocalDescription(answer);
    sendMessage(
      JSON.stringify({
        type: "webrtc.answer",
        data: {
          room_id: roomId,
          answer: answer,
        },
      })
    );
  };

  const receiveAnswer = async (answer: RTCSessionDescriptionInit) => {
    await peerConnection.current?.setRemoteDescription(
      new RTCSessionDescription(answer)
    );

    InCallManager.start({ media: "audio" });

    for (const candidate of pendingCandidates.current) {
      await peerConnection.current?.addIceCandidate(candidate);
    }
    pendingCandidates.current = [];
  };

  const receiveCandidate = async (candidate: any) => {
    if (!peerConnection.current?.remoteDescription) {
      pendingCandidates.current.push(candidate);
      return;
    }

    await peerConnection.current?.addIceCandidate(candidate);
  };

  const endCall = useCallback(() => {
    sendMessage(
      JSON.stringify({
        type: "call.end",
        data: {
          room_id: roomId,
        },
      })
    );
  }, [sendMessage, roomId]);

  useEffect(() => {
    if (lastMessage) {
      switch (lastMessage.type) {
        case "webrtc.error":
          Alert.alert("Error", lastMessage.data.reason);
          break;
        case "webrtc.offer":
          createAnswer(lastMessage.data.room_id, lastMessage.data.offer);
          break;
        case "webrtc.answer":
          receiveAnswer(lastMessage.data.answer);
          break;
        case "webrtc.candidate":
          receiveCandidate(lastMessage.data.candidate);
          break;
        case "call.ended":
          router.replace("/");
          break;
      }
    }
  }, [lastMessage]);

  const cleanup = () => {
    peerConnection.current?.close();
    peerConnection.current = null;

    stream.current?.getTracks().forEach((t) => t.stop());
    stream.current = null;

    InCallManager.stop();
  };

  useEffect(() => {
    init();

    return () => {
      cleanup();
    };
  }, []);

  return { endCall };
};

export default useWebRtc;
