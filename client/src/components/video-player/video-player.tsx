import { useEffect, useRef, useState } from 'react';
import styles from './video-player.module.scss';
import ReactPlayer from 'react-player';
import { Controls } from '../contrlols';
import VideoService from '../../services/VideoService';

interface Props {
    video_link: string;
    uuid: string;
}

const VideoPlayer: React.FC<Props> = ({ video_link, uuid }) => {
    const videoRef = useRef(null) as any;

    //@ts-ignore
    const supportsTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);


    const [isRendered, setRendered] = useState(false);
    const [isPlaying, setPlaying] = useState(false);
    const [totalDuration, setTotalDuration] = useState(null);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [isMuted, setMuted] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [isFullScreen, setFullScreen] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [progress, setProgress] = useState(0);
    const [wasPaused, setWasPaused] = useState(true);

    const [timeoutId, setTimeoutId] = useState() as any;
    const [show, setShow] = useState(false);
    const [enabledPlayButton, setEnabledPlayButton] = useState(true);

    const handleMouseMove = () => {
        setShow(true);
        clearTimeout(timeoutId);
        setTimeoutId(setTimeout(() => setShow(false), 2000));
    }

    const handleClick = async () => {
        setPlaying(true);
        setWasPaused(false);
        setEnabledPlayButton(false);
        const response = await VideoService.playVideo(uuid);
    }

    const handleTouch = () => {
        setShow(true)
        clearTimeout(timeoutId);
        setTimeoutId(setTimeout(() => setShow(false), 2000));
    }

    return (
        <div id='wrapper'
            className={styles.videoPlayer}
            onMouseMove={enabledPlayButton || supportsTouch ? undefined : handleMouseMove}
            onTouchStart={supportsTouch ? handleTouch : undefined}
        >
            {
                enabledPlayButton && <button className={styles.playButton} onClick={handleClick}>
                    <svg viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg" className="gutwyL">
                        <circle cx="44" cy="44" r="44"></circle>
                        <path d="M32 60.7151V27.5152C32 25.9643 33.6886 25.0036 35.0218 25.7959L64.9017 43.554C66.2513 44.3561 66.1929 46.3293 64.7982 47.05L34.9182 62.4919C33.587 63.1798 32 62.2136 32 60.7151Z">
                        </path>
                    </svg>
                </button>
            }
            <ReactPlayer
                ref={videoRef}
                width={'100%'}
                height={'100%'}
                url={video_link}
                controls={false}
                playing={isPlaying}
                playbackRate={playbackRate}
                muted={isMuted}
                volume={volume}
                onReady={() => setRendered(true)}
                config={{
                    file: {
                        attributes: {
                            onTimeUpdate: (e: any) => {
                                setCurrentTime(e.target.currentTime)
                                const percent = (e.target.currentTime / e.target.duration) * 100
                                setProgress(percent);
                            },
                            onLoadedMetadata: (e: any) => setTotalDuration(e.target.duration)
                        }
                    }
                }}
            />
            <Controls
                ref={videoRef}
                totalDuration={totalDuration}
                isPlaying={isPlaying}
                setPlaying={setPlaying}
                playbackRate={playbackRate}
                setPlaybackRate={setPlaybackRate}
                isMuted={isMuted}
                setMuted={setMuted}
                volume={volume}
                setVolume={setVolume}
                isFullScreen={isFullScreen}
                setFullScreen={setFullScreen}
                currentTime={currentTime}
                setCurrentTime={setCurrentTime}
                progress={progress}
                setProgress={setProgress}
                wasPaused={wasPaused}
                setWasPaused={setWasPaused}
                show={show}
            />
        </div>
    );
};

export default VideoPlayer;
