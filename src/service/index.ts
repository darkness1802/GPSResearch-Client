import axios, { AxiosInstance } from "axios";

const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};

const error = (err:any) => {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

function getLatLong () {
    let lat:any
    let long:any
    navigator.geolocation.getCurrentPosition((position:any) => {
        const Coords = position.coords;
        lat = Coords.latitude
        long = Coords.longitude
    }, error, options);
    return ({ lat, long })
}

export class BaseService {
    private baseUrl;
    public instance: AxiosInstance;

    constructor(baseUrl?: string) {
        this.baseUrl = baseUrl;

        this.instance = axios.create({
            timeout: 30000,
            timeoutErrorMessage: "Request Timeout",
            baseURL: this.baseUrl,
        });

        // Middleware với mỗi request
        this.instance.interceptors.request.use(
            (config: any) => {
                let token = localStorage.getItem("auth")
                navigator.geolocation.getCurrentPosition((position:any) => {
                    const Coords = position.coords;
                    let lat = Coords.latitude
                    let long = Coords.longitude
                    sessionStorage.setItem(`lat`, lat)
                    sessionStorage.setItem(`long`, long)
                }, error, options);

                if (token) config.headers["auth"] = `${token}`;
                let lat = sessionStorage.getItem(`lat`)
                let long = sessionStorage.getItem(`long`)

                config.headers["lat"] = `${lat}`;
                config.headers["long"] = `${long}`;

                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Một khi request thành công
        this.instance.interceptors.response.use(
            (response) => {
                console.log("Request: Success");
                return response;
            },
            (error) => { // Hoặc khi thất bại
                if (error.response) {
                    if (error.response?.status === 401) { // Khi không hoặc truyền lên 1 token bất hợp lệ
                        // Tạo hiệu ứng sign out cho app
                    }
                    console.log("Request: Error");
                    return Promise.reject(error.response);
                }

                console.log("Err: ", error);
                return Promise.reject(error);
            }
        );
    }
}
