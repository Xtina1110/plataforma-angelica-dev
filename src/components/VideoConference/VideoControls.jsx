import React from 'react';
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";

const VideoControls = ({ 
  isVideoEnabled, 
  isAudioEnabled, 
  isScreenSharing,
  onToggleVideo,
  onToggleAudio,
  onToggleScreenShare,
  onEndCall
}) => {
  return (
    <Card className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <CardContent className="flex items-center space-x-2 p-3">
        <Button
          variant={isVideoEnabled ? "default" : "destructive"}
          size="icon"
          onClick={onToggleVideo}
        >
          {isVideoEnabled ? "📹" : "📹"}
        </Button>
        
        <Button
          variant={isAudioEnabled ? "default" : "destructive"}
          size="icon"
          onClick={onToggleAudio}
        >
          {isAudioEnabled ? "🎤" : "🔇"}
        </Button>
        
        <Button
          variant={isScreenSharing ? "default" : "outline"}
          size="icon"
          onClick={onToggleScreenShare}
        >
          🖥️
        </Button>
        
        <Button
          variant="destructive"
          size="icon"
          onClick={onEndCall}
        >
          📞
        </Button>
      </CardContent>
    </Card>
  );
};

export default VideoControls;