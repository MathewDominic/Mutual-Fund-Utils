class ApiClient {
    constructor() {
        this.baseUrl = "http://localhost:8000/"
    }
    post(url, body, onSuccessCallback) {
        fetch(this.baseUrl + url, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => onSuccessCallback(data),
              error => console.log("Error in http call", error));
    }
    get(url, onSuccessCallback) {
        fetch(this.baseUrl + url)
            .then(res => res.json())
            .then(data => onSuccessCallback(data),
                  error => console.log("Error in http call", error)
            )
    }
}

export default ApiClient;
