import $api from "../http";
import {AxiosResponse} from 'axios';

export default class VideoService {
    static fetchVideo(id: string): Promise<AxiosResponse<any>> {
        return $api.get(`/share/${id}`);
    };

    static playVideo(id: string): Promise<AxiosResponse<any>> {
        return $api.post(`/play/${id}`);
    }

    static ctaClicked(id: string): Promise<AxiosResponse<any>> {
        return $api.post(`/cta/${id}`);
    }
}