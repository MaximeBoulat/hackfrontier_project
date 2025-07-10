console.log("running test chat")
const resp = await fetch("http://localhost:8080/chat", {
    method: "POST",
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message: `give an interesting summary of the below scene described in json:
        [
  {
    "objects": [
      {
        "category": "common-objects",
        "classId": 28,
        "classLabel": "cup",
        "confidence": 0.9615,
        "height": 149.911,
        "id": 102,
        "orientation": 0,
        "width": 113.932,
        "x": 251.211,
        "y": 181.642
      },
      {
        "category": "common-objects",
        "classId": 28,
        "classLabel": "cup",
        "confidence": 0.9361,
        "height": 143.834,
        "id": 103,
        "orientation": 0,
        "width": 113.693,
        "x": 109.907,
        "y": 159.891
      },
      {
        "category": "common-objects",
        "classId": 26,
        "classLabel": "bottle",
        "confidence": 0.9126,
        "height": 139.382,
        "id": 104,
        "orientation": 0,
        "width": 87.983,
        "x": 0,
        "y": 135.61
      },
      {
        "category": "common-objects",
        "classId": 28,
        "classLabel": "cup",
        "confidence": 0.9058,
        "height": 187.67,
        "id": 105,
        "orientation": 0,
        "width": 134.648,
        "x": 172.064,
        "y": 244.985
      },
      {
        "category": "common-objects",
        "classId": 28,
        "classLabel": "cup",
        "confidence": 0.9017,
        "height": 179.612,
        "id": 106,
        "orientation": 0,
        "width": 137.584,
        "x": 31.458,
        "y": 213.984
      },
      {
        "category": "common-objects",
        "classId": 28,
        "classLabel": "cup",
        "confidence": 0.8992,
        "height": 204.84,
        "id": 107,
        "orientation": 0,
        "width": 78.603,
        "x": 1.024,
        "y": 273.858
      },
      {
        "category": "common-objects",
        "classId": 31,
        "classLabel": "chair",
        "confidence": 0.8365,
        "height": 47.572,
        "id": 108,
        "orientation": 0,
        "width": 112.99,
        "x": 128.135,
        "y": 1.21
      },
      {
        "category": "common-objects",
        "classId": 1,
        "classLabel": "person",
        "confidence": 0.831,
        "height": 238.723,
        "id": 109,
        "orientation": 0,
        "width": 539.247,
        "x": 100.752,
        "y": 0.142
      },
      {
        "category": "common-objects",
        "classId": 35,
        "classLabel": "dining table",
        "confidence": 0.804,
        "height": 441.495,
        "id": 110,
        "orientation": 0,
        "width": 639.636,
        "x": 0.342,
        "y": 38.504
      }
    ],
    "seconds": 0,
    "source_height": 480,
    "source_id": "dea482b2-5d4f-11f0-9fe1-0242ac110002",
    "source_width": 640,
    "system_timestamp": 1752125806867925000,
    "timestamp": 0
  }
]
        ` })
});
console.log(await resp.json())
