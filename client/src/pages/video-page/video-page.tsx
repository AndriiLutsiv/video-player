import { useEffect, useState } from 'react';
import styles from './video-page.module.scss';
import { VideoPlayer } from '../../components/video-player';
import VideoService from '../../services/VideoService';
import { Loader } from '../../components/loader';
import { useLocation, useParams } from 'react-router-dom';

const VideoPage: React.FC = () => {
    const [meeting_link, setMeeting_link] = useState('');
    const [person, setPerson] = useState('');
    const [logo_url, setLogo_url] = useState('');
    const [video_link, setVideo_link] = useState('');
    const [videoUUID, setVideoUUID] = useState('');

    const params = useParams() as { id: string };

    useEffect(() => {
        getVideo();
    }, []);

    async function getVideo() {
        try {
            const response = await VideoService.fetchVideo(params.id);
            setMeeting_link(response.data.meeting_link);
            setPerson(response.data.person);
            setLogo_url(response.data.logo_url);
            setVideo_link(response.data.video_link);
            setVideoUUID(response.data.uuid);
        } catch (e) {
            console.log(e);
        }
    }

    async function ctaClick() {
        try {
            const response = await VideoService.ctaClicked(videoUUID);
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <div className={styles.videoPage}>
            <div className={styles.logoContainer}>
                <img src={logo_url} alt="logo" />
            </div>
            <h1 className={styles.title}>Nice to meet you {person}!</h1>
            {
                video_link ? <VideoPlayer video_link={video_link} uuid={videoUUID} />
                    : <div className={styles.space}>
                        <Loader />
                    </div>
            }
            <h2 className={styles.subtitle}>Schedule a 30 min meeting to learn more.</h2>
            <a
                href={meeting_link}
                target='_blank'
                className={styles.button}
                onClick={ctaClick}
            >
                Schedule a meeting
            </a>
        </div>
    );
};

export default VideoPage;
