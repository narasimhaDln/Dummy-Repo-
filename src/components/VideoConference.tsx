import React, { useState } from 'react';
import { 
  Mic, MicOff, Video, VideoOff, Share, Hand, Users, Settings, 
  Layout, Pin, MoreVertical, UserPlus, Grid, Maximize2, 
  MessageSquare, PhoneOff, Smile, Volume2, Volume1, VolumeX,
  Users as UsersGroup
} from 'lucide-react';

interface Participant {
  id: number;
  name: string;
  isSpeaking: boolean;
  handRaised: boolean;
  role: 'teacher' | 'student';
  isMuted: boolean;
  isVideoOff: boolean;
  isPinned: boolean;
  audioLevel: number;
  isScreenSharing: boolean;
  inBreakoutRoom?: number;
}

interface BreakoutRoom {
  id: number;
  name: string;
  participants: number[];
}

export default function VideoConference() {
  const [participants, setParticipants] = useState<Participant[]>([
    { id: 1, name: 'Teacher Smith', isSpeaking: true, handRaised: false, role: 'teacher', isMuted: false, isVideoOff: false, isPinned: true, audioLevel: 0.8, isScreenSharing: false },
    { id: 2, name: 'John Doe', isSpeaking: false, handRaised: true, role: 'student', isMuted: true, isVideoOff: false, isPinned: false, audioLevel: 0, isScreenSharing: false },
    { id: 3, name: 'Jane Smith', isSpeaking: false, handRaised: false, role: 'student', isMuted: false, isVideoOff: true, isPinned: false, audioLevel: 0.3, isScreenSharing: false },
    { id: 4, name: 'Mike Johnson', isSpeaking: false, handRaised: false, role: 'student', isMuted: false, isVideoOff: false, isPinned: false, audioLevel: 0.5, isScreenSharing: true },
  ]);

  const [breakoutRooms, setBreakoutRooms] = useState<BreakoutRoom[]>([
    { id: 1, name: 'Group 1', participants: [2, 3] },
    { id: 2, name: 'Group 2', participants: [4] },
  ]);

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [handRaised, setHandRaised] = useState(false);
  const [layout, setLayout] = useState<'grid' | 'spotlight' | 'presentation'>('grid');
  const [showParticipants, setShowParticipants] = useState(false);
  const [showBreakoutRooms, setShowBreakoutRooms] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [volume, setVolume] = useState(1);

  const togglePin = (participantId: number) => {
    setParticipants(participants.map(p => ({
      ...p,
      isPinned: p.id === participantId ? !p.isPinned : false
    })));
  };

  const toggleMute = (participantId: number) => {
    setParticipants(participants.map(p => ({
      ...p,
      isMuted: p.id === participantId ? !p.isMuted : p.isMuted
    })));
  };

  const toggleVideo = (participantId: number) => {
    setParticipants(participants.map(p => ({
      ...p,
      isVideoOff: p.id === participantId ? !p.isVideoOff : p.isVideoOff
    })));
  };

  const createBreakoutRoom = () => {
    const newRoom: BreakoutRoom = {
      id: breakoutRooms.length + 1,
      name: `Group ${breakoutRooms.length + 1}`,
      participants: []
    };
    setBreakoutRooms([...breakoutRooms, newRoom]);
  };

  const moveToBreakoutRoom = (participantId: number, roomId: number) => {
    setBreakoutRooms(rooms => rooms.map(room => ({
      ...room,
      participants: room.id === roomId 
        ? [...room.participants, participantId]
        : room.participants.filter(id => id !== participantId)
    })));
  };

  const pinnedParticipant = participants.find(p => p.isPinned);
  const screenSharingParticipant = participants.find(p => p.isScreenSharing);

  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeX />;
    if (volume < 0.5) return <Volume1 />;
    return <Volume2 />;
  };

  return (
    <div className="bg-gray-900 p-4 rounded-lg relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-white text-lg font-semibold flex items-center space-x-2">
          <span>Live Session</span>
          {screenSharingParticipant && (
            <span className="text-sm text-green-400">
              {screenSharingParticipant.name} is sharing screen
            </span>
          )}
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setLayout(prev => 
              prev === 'grid' ? 'spotlight' : prev === 'spotlight' ? 'presentation' : 'grid'
            )}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white tooltip-container"
          >
            <Layout size={20} />
            <span className="tooltip">Change Layout</span>
          </button>
          <button
            onClick={() => setShowBreakoutRooms(!showBreakoutRooms)}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white tooltip-container"
          >
            <UsersGroup size={20} />
            <span className="tooltip">Breakout Rooms</span>
          </button>
          <button
            onClick={() => setShowParticipants(!showParticipants)}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white tooltip-container"
          >
            <Users size={20} />
            <span className="tooltip">Participants ({participants.length})</span>
          </button>
          <button
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white tooltip-container"
          >
            <Maximize2 size={20} />
            <span className="tooltip">Toggle Fullscreen</span>
          </button>
        </div>
      </div>

      <div className={`grid ${
        layout === 'grid' 
          ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
          : layout === 'spotlight' && pinnedParticipant 
          ? 'grid-cols-1' 
          : 'grid-cols-1'
      } gap-4 mb-4`}>
        {layout === 'spotlight' && pinnedParticipant ? (
          <div className="col-span-full aspect-video bg-gray-800 rounded-lg overflow-hidden relative">
            <img
              src={`https://source.unsplash.com/random/800x600?face&sig=${pinnedParticipant.id}`}
              alt={pinnedParticipant.name}
              className="w-full h-full object-cover"
            />
            <ParticipantOverlay 
              participant={pinnedParticipant} 
              onPin={togglePin}
              onMute={toggleMute}
              onVideoToggle={toggleVideo}
            />
          </div>
        ) : null}
        
        <div className={layout === 'spotlight' && pinnedParticipant ? 'grid grid-cols-4 gap-2' : ''}>
          {participants
            .filter(p => layout === 'grid' || !p.isPinned)
            .map((participant) => (
              <div
                key={participant.id}
                className={`relative aspect-video bg-gray-800 rounded-lg overflow-hidden ${
                  layout === 'spotlight' && pinnedParticipant ? 'col-span-1' : ''
                } ${participant.isScreenSharing ? 'col-span-full' : ''}`}
              >
                {!participant.isVideoOff ? (
                  <img
                    src={`https://source.unsplash.com/random/300x200?face&sig=${participant.id}`}
                    alt={participant.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-700">
                    <div className="w-20 h-20 rounded-full bg-gray-600 flex items-center justify-center">
                      <span className="text-2xl text-white">{participant.name[0]}</span>
                    </div>
                  </div>
                )}
                <ParticipantOverlay 
                  participant={participant}
                  onPin={togglePin}
                  onMute={toggleMute}
                  onVideoToggle={toggleVideo}
                />
                {participant.audioLevel > 0 && !participant.isMuted && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500"
                       style={{ width: `${participant.audioLevel * 100}%` }}
                  />
                )}
              </div>
            ))}
        </div>
      </div>

      {showParticipants && (
        <div className="absolute right-4 top-20 w-64 bg-white rounded-lg shadow-lg p-4 z-10">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Participants ({participants.length})</h3>
            <button
              onClick={() => setShowParticipants(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {participants.map(participant => (
              <div key={participant.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                <div className="flex items-center">
                  <span className={`w-2 h-2 rounded-full ${participant.isSpeaking ? 'bg-green-500' : 'bg-gray-300'} mr-2`}></span>
                  <span>{participant.name}</span>
                </div>
                <div className="flex items-center space-x-1">
                  {participant.handRaised && <Hand size={16} className="text-yellow-500" />}
                  {participant.isMuted && <MicOff size={16} className="text-red-500" />}
                  {participant.isScreenSharing && <Share size={16} className="text-blue-500" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showBreakoutRooms && (
        <div className="absolute left-4 top-20 w-72 bg-white rounded-lg shadow-lg p-4 z-10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Breakout Rooms</h3>
            <button
              onClick={createBreakoutRoom}
              className="text-blue-500 hover:text-blue-700"
            >
              <UserPlus size={16} />
            </button>
          </div>
          <div className="space-y-4">
            {breakoutRooms.map(room => (
              <div key={room.id} className="border rounded-lg p-3">
                <h4 className="font-medium mb-2">{room.name}</h4>
                <div className="space-y-1">
                  {room.participants.map(participantId => {
                    const participant = participants.find(p => p.id === participantId);
                    return participant ? (
                      <div key={participant.id} className="flex items-center justify-between text-sm">
                        <span>{participant.name}</span>
                        <button
                          onClick={() => moveToBreakoutRoom(participant.id, 0)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-center space-x-4 py-4 border-t border-gray-700">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={`p-3 rounded-full ${
            isMuted ? 'bg-red-500' : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          {isMuted ? (
            <MicOff className="text-white" size={20} />
          ) : (
            <Mic className="text-white" size={20} />
          )}
        </button>
        <button
          onClick={() => setIsVideoOn(!isVideoOn)}
          className={`p-3 rounded-full ${
            !isVideoOn ? 'bg-red-500' : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          {isVideoOn ? (
            <Video className="text-white" size={20} />
          ) : (
            <VideoOff className="text-white" size={20} />
          )}
        </button>
        <button className="p-3 rounded-full bg-gray-700 hover:bg-gray-600">
          <Share className="text-white" size={20} />
        </button>
        <button
          onClick={() => setHandRaised(!handRaised)}
          className={`p-3 rounded-full ${
            handRaised ? 'bg-yellow-500' : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          <Hand className="text-white" size={20} />
        </button>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setVolume(prev => (prev === 0 ? 1 : 0))}
            className="p-3 rounded-full bg-gray-700 hover:bg-gray-600"
          >
            {getVolumeIcon()}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-24"
          />
        </div>
        <button
          onClick={() => setShowEmoji(!showEmoji)}
          className="p-3 rounded-full bg-gray-700 hover:bg-gray-600"
        >
          <Smile className="text-white" size={20} />
        </button>
        <button className="p-3 rounded-full bg-red-500 hover:bg-red-600">
          <PhoneOff className="text-white" size={20} />
        </button>
      </div>

      {showEmoji && (
        <div className="absolute bottom-20 right-4 bg-white rounded-lg shadow-lg p-4">
          <div className="grid grid-cols-4 gap-2">
            {['👍', '👏', '❤️', '😊', '😂', '🎉', '👋', '🤔'].map(emoji => (
              <button
                key={emoji}
                onClick={() => {
                  // Handle emoji reaction
                  setShowEmoji(false);
                }}
                className="text-2xl hover:bg-gray-100 p-2 rounded"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface ParticipantOverlayProps {
  participant: Participant;
  onPin: (id: number) => void;
  onMute: (id: number) => void;
  onVideoToggle: (id: number) => void;
}

function ParticipantOverlay({ participant, onPin, onMute, onVideoToggle }: ParticipantOverlayProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-white text-sm">{participant.name}</span>
          {participant.isSpeaking && (
            <span className="flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {participant.handRaised && (
            <Hand size={16} className="text-yellow-400" />
          )}
          {participant.isMuted && (
            <MicOff size={16} className="text-red-400" />
          )}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-white hover:bg-gray-700 rounded-full p-1"
            >
              <MoreVertical size={16} />
            </button>
            {showMenu && (
              <div className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10">
                <button
                  onClick={() => onPin(participant.id)}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
                >
                  <Pin size={16} className="mr-2" />
                  {participant.isPinned ? 'Unpin' : 'Pin'} participant
                </button>
                <button
                  onClick={() => onMute(participant.id)}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
                >
                  {participant.isMuted ? <Mic size={16} className="mr-2" /> : <MicOff size={16} className="mr-2" />}
                  {participant.isMuted ? 'Unmute' : 'Mute'} participant
                </button>
                <button
                  onClick={() => onVideoToggle(participant.id)}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
                >
                  {participant.isVideoOff ? <Video size={16} className="mr-2" /> : <VideoOff size={16} className="mr-2" />}
                  {participant.isVideoOff ? 'Enable' : 'Disable'} video
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}