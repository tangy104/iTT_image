import React, {useState, useEffect} from 'react';
import {View, Button} from 'react-native';
// import {RNCamera} from 'react-native-camera';
import {FFmpegKit} from 'ffmpeg-kit-react-native';

const RTMPStreamingScreen = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const streamUrl = 'rtmp://10.145.72.117:1935/tv/lemon';

  useEffect(() => {
    return () => {
      // Stop the streaming session when component unmounts
      if (sessionId) {
        FFmpegKit.cancel(sessionId);
      }
    };
  }, [sessionId]);

  const startStreaming = async () => {
    try {
      // const arguments = `-re -i /dev/video0 -c:v copy -f flv ${streamUrl}`;
      const session = await FFmpegKit.executeAsync(
        `-re -i /dev/video0 -c:v copy -f flv ${streamUrl}`,
        async session => {
          setIsStreaming(false);
          setSessionId(null);
          console.log('Streaming stopped:', session);
        },
        async session => {
          console.error('Error while streaming:', session);
        },
      );
      setSessionId(session.getSessionId());
      setIsStreaming(true);
    } catch (error) {
      console.error('Error starting streaming:', error);
    }
  };

  const stopStreaming = () => {
    if (sessionId) {
      FFmpegKit.cancel(sessionId);
    }
  };

  return (
    <View style={{flex: 1}}>
      <RNCamera
        style={{flex: 1}}
        type={RNCamera.Constants.Type.back}
        captureAudio={true}
      />
      <View
        style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {!isStreaming ? (
          <Button title="Start Streaming" onPress={startStreaming} />
        ) : (
          <Button title="Stop Streaming" onPress={stopStreaming} />
        )}
      </View>
    </View>
  );
};

export default RTMPStreamingScreen;
