# MELDify

Video sentiment analysis API and web app using multimodal fusion of text, audio, and video frames.

## Tech Used

* **Frontend**: Next.js (hosted on Vercel)
* **Backend**: FastAPI (Python)
* **Deep Learning**: PyTorch, Transformers (BERT for text)
* **Infrastructure**: Docker, AWS EC2 (backend), ngrok (for HTTPS proxy)

## Features

* Upload a video from the web app ([https://meldify.vercel.app](https://meldify.vercel.app)) and instantly get sentiment results.
* Predict sentiment using multimodal fusion:

  * **Text** from transcripts → BERT embeddings
  * **Video frames** → CNN features
  * **Audio** → Mel spectrogram features
* REST API with API key authentication
* Monthly quotas per user (e.g., 1000 requests)
* Web dashboard + API usage examples

## API Usage

Use your secret API key to authorize requests. Keep it private.

### TypeScript Example

```ts
const file = input.files[0];
const formData = new FormData();
formData.append("video", file);

const response = await fetch("https://blessed-remotely-jennet.ngrok-free.app/predict", {
  method: "POST",
  headers: { Authorization: "Bearer " + apiKey },
  body: formData,
});

const result = await response.json();
console.log(result);
```

### cURL Example

```bash
curl -X POST "https://blessed-remotely-jennet.ngrok-free.app/predict" \
  -H "Authorization: Bearer $API_KEY" \
  -F "video=@sample.mp4"
```

### Example Response

```json
{
  "label": "negative",
  "score": 0.81,
  "details": {
    "text_sentiment": "negative",
    "audio_sentiment": "neutral",
    "video_sentiment": "negative"
  }
}
```

---

## Web App

* **URL**: [meldify.vercel.app](https://meldify.vercel.app)
* Users can upload video directly through the interface.
* Results are shown on the page with predicted label and confidence score.
* Authenticated requests are counted against your monthly API quota.

---

*Secure, multimodal video sentiment analysis — usable via API or web app.*
