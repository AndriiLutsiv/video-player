import React, { useEffect, useRef, useState } from 'react';
import { formatDuration } from '../video-player/utils/formatDuration';
import screenfull from 'screenfull';
import classNames from 'classnames';
import styles from './controls.module.scss';

interface Props {
    totalDuration: number | null;
    isPlaying: boolean;
    setPlaying: React.Dispatch<React.SetStateAction<boolean>>;
    playbackRate: number;
    setPlaybackRate: React.Dispatch<React.SetStateAction<number>>;
    isMuted: boolean;
    setMuted: React.Dispatch<React.SetStateAction<boolean>>;
    volume: number;
    setVolume: React.Dispatch<React.SetStateAction<number>>;
    isFullScreen: boolean;
    setFullScreen: React.Dispatch<React.SetStateAction<boolean>>;
    currentTime: number;
    progress: number;
    setCurrentTime: React.Dispatch<React.SetStateAction<number>>;
    setProgress: React.Dispatch<React.SetStateAction<number>>;
    wasPaused: boolean;
    setWasPaused: React.Dispatch<React.SetStateAction<boolean>>;
    show: boolean;
}

const Controls = React.forwardRef<HTMLElement, Props>((props, ref) => {
    const {
        totalDuration,
        isPlaying, setPlaying,
        playbackRate,
        setPlaybackRate,
        isMuted,
        setMuted,
        volume,
        setVolume,
        isFullScreen,
        setFullScreen,
        currentTime,
        setCurrentTime,
        progress,
        setProgress,
        wasPaused,
        setWasPaused,
        show
    } = props;

    const timelineContainerRef = useRef<HTMLDivElement | null>(null);
    //@ts-ignore
    const videoRef = ref.current;
    //@ts-ignore
    const supportsTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);

    const togglePlay = () => {
        setWasPaused(wasPaused ? false : true);
        setPlaying(isPlaying ? false : true);
    }

    const changePlaybackSpeed = () => {
        const newPlaybackRate = playbackRate + 0.25;
        setPlaybackRate(newPlaybackRate > 2 ? 0.25 : newPlaybackRate);
    }

    //volume
    const toggleMute = () => setMuted(isMuted ? false : true);

    const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => setVolume(+e.target.value);

    const toggleFullScreenMode = () => {
        if (screenfull.isEnabled) {
            const target = document.getElementById('wrapper')!;
            screenfull.toggle(target);
        }
    }

    //rewind
    const rewindForward = () => videoRef.seekTo(videoRef.getCurrentTime() + 5);
    const rewindBackward = () => videoRef.seekTo(videoRef.getCurrentTime() - 5);

    // Timeline
    const [isScrubbing, setIsScrubbing] = useState(false);

    function startScrubbing(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        const enableScrubbing = (e.buttons & 1) === 1;
        if (enableScrubbing) {
            setPlaying(false);
            setIsScrubbing(enableScrubbing);
        }
    }

    function finishScrubbing(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        handleTimelineUpdate(e)
        setIsScrubbing(false);
        setPlaying(wasPaused ? false : true);
    }

    const handleTimelineUpdate = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (isScrubbing) {
            const rect = timelineContainerRef.current?.getBoundingClientRect()!;
            const percent = Math.min(Math.max(0, e.clientX - rect.x), rect.width) / rect.width
            setCurrentTime(totalDuration! * percent);
            setProgress(percent * 100);
            videoRef.seekTo(percent * totalDuration!);
        }
    }

    useEffect(() => {
        const handleMouseUp = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            isScrubbing && finishScrubbing(e);
        }//@ts-ignore
        document.addEventListener('mouseup', handleMouseUp);

        return () => {//@ts-ignore
            document.removeEventListener('mouseup', handleMouseUp);
        }
    }, [isScrubbing])

    const handlePointerDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const rect = timelineContainerRef.current?.getBoundingClientRect()!;
        const percent = Math.min(Math.max(0, e.clientX - rect.x), rect.width) / rect.width
        setCurrentTime(totalDuration! * percent);
        setProgress(percent * 100);
        videoRef.seekTo(percent * totalDuration!);
    }

    return (
        <div
            className={classNames(styles.videoControlsContainer, { [styles.isVisible]: show })}
        >
            <div
                ref={timelineContainerRef}
                className={styles.timelineContainer}
                onMouseMove={supportsTouch ? undefined : handleTimelineUpdate}
                onMouseDown={supportsTouch ? undefined : startScrubbing}
                onMouseUp={supportsTouch ? undefined : finishScrubbing}
                onPointerDown={supportsTouch ? handlePointerDown : undefined}
            >
                <div className={styles.timeline}>
                    <div className={styles.thumbIndicator} style={{ left: `${progress}%` }}></div>
                    <div className={styles.timelineOverlay} style={{ right: `calc(100% - ${progress}%)` }}></div>
                </div>
            </div>
            <div className={styles.controls}>
                <button onClick={togglePlay}>
                    {
                        isPlaying ?
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="6" y="6" width="4" height="12" rx="1" stroke="white" strokeWidth="2"></rect><rect x="14" y="6" width="4" height="12" rx="1" stroke="white" strokeWidth="2"></rect>
                            </svg>
                            :
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7 17.259V6.74104C7 5.96925 7.83721 5.48837 8.50387 5.87726L17.5192 11.1362C18.1807 11.5221 18.1807 12.4779 17.5192 12.8638L8.50387 18.1227C7.83721 18.5116 7 18.0308 7 17.259Z" stroke="white" strokeWidth="2" strokeLinecap="round"></path>
                            </svg>
                    }
                </button>
                <button onClick={rewindBackward}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 13C5 16.866 8.13401 20 12 20C15.866 20 19 16.866 19 13C19 9.13401 15.866 6 12 6H10" stroke="white" strokeWidth="2" strokeLinecap="round"></path><path d="M12 4L10 6L12 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><path d="M8 4L6 6L8 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><path d="M13.0224 11H11.1414C10.604 11 10.604 11.9756 10.604 12.6123C10.604 13.2489 11.0217 12.6123 11.8877 12.6123C12.7538 12.6123 13.5 13.3341 13.5 14.2246C13.5 15.115 12.7538 15.8369 11.8877 15.8369C11.1415 15.8369 10.604 15.2994 10.5 15.0354" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                </button>
                <button onClick={rewindForward}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 13C19 16.866 15.866 20 12 20C8.13401 20 5 16.866 5 13C5 9.13401 8.13401 6 12 6H14" stroke="white" strokeWidth="2" strokeLinecap="round"></path><path d="M12 4L14 6L12 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><path d="M16 4L18 6L16 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><path d="M13.0224 11H11.1414C10.604 11 10.604 11.9756 10.604 12.6123C10.604 13.2489 11.0217 12.6123 11.8877 12.6123C12.7538 12.6123 13.5 13.3341 13.5 14.2246C13.5 15.115 12.7538 15.8369 11.8877 15.8369C11.1415 15.8369 10.604 15.2994 10.5 15.0354" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                </button>
                <div className={styles.volumeContainer}>
                    <button onClick={toggleMute}>
                        {
                            isMuted || volume === 0 ?
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16 9.5L21 14.5M21 9.5L16 14.5" stroke="white" strokeWidth="2" strokeLinecap="round"></path><path d="M3 12C3 6.61539 3.78947 10.1539 8 8.00001C10.3434 6.80125 12 5 12 5V19C12 19 10.6143 17.3373 8 16C3.78947 13.8462 3 17.3846 3 12Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                </svg>
                                : volume > 0 && volume < 0.5 ?
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M16 9C16.6137 9.73243 17 10.7968 17 11.9815C17 13.1661 16.6137 14.2305 16 14.963" stroke="white" strokeWidth="2" strokeLinecap="round"></path><path d="M3 12C3 6.61539 3.78947 10.1539 8 8.00001C10.3434 6.80125 12 5 12 5V19C12 19 10.6143 17.3373 8 16C3.78947 13.8462 3 17.3846 3 12Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                    </svg>
                                    :
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M19 5.70131C20.2372 7.32457 21 9.54775 21 12C21 14.4523 20.2372 16.6754 19 18.2987" stroke="white" strokeWidth="2" strokeLinecap="round"></path><path d="M16 9C16.6137 9.73243 17 10.7968 17 11.9815C17 13.1661 16.6137 14.2305 16 14.963" stroke="white" strokeWidth="2" strokeLinecap="round"></path><path d="M3 12C3 6.61539 3.78947 10.1539 8 8.00001C10.3434 6.80125 12 5 12 5V19C12 19 10.6143 17.3373 8 16C3.78947 13.8462 3 17.3846 3 12Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                    </svg>
                        }
                    </button>
                    <input className={styles.volumeSlider} type="range" min="0" max="1" step="any" value={volume} onChange={handleVolume} />
                </div>
                <div className={styles.durationContainer}>
                    <div>{videoRef ? formatDuration(currentTime) : '0:00'}</div>
                    /
                    <div>{formatDuration(totalDuration) || '00:00:00'}</div>
                </div>
                <button onClick={changePlaybackSpeed}>
                    {playbackRate}x
                </button>
                <button onClick={toggleFullScreenMode}>
                    {
                        isFullScreen ?
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 5V8C8 8.55228 7.55228 9 7 9H4" stroke="white" strokeWidth="2" strokeLinecap="round"></path><path d="M8 19V16C8 15.4477 7.55228 15 7 15H4" stroke="white" strokeWidth="2" strokeLinecap="round"></path><path d="M16 5V8C16 8.55228 16.4477 9 17 9H20" stroke="white" strokeWidth="2" strokeLinecap="round"></path><path d="M16 19V16C16 15.4477 16.4477 15 17 15H20" stroke="white" strokeWidth="2" strokeLinecap="round"></path>
                            </svg>
                            :
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 9V6C3 5.44772 3.44772 5 4 5H7" stroke="white" strokeWidth="2" strokeLinecap="round"></path><path d="M3 15V18C3 18.5523 3.44772 19 4 19H7" stroke="white" strokeWidth="2" strokeLinecap="round"></path><path d="M21 9V6C21 5.44772 20.5523 5 20 5H17" stroke="white" strokeWidth="2" strokeLinecap="round"></path><path d="M21 15V18C21 18.5523 20.5523 19 20 19H17" stroke="white" strokeWidth="2" strokeLinecap="round"></path><rect x="7" y="9" width="10" height="6" rx="1" stroke="white" strokeWidth="2"></rect>
                            </svg>
                    }
                </button>
            </div>
        </div>
    );
});

export default Controls;
