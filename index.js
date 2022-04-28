
const express = require('express')
const Minio = require('minio')

const app = express()
const port = 8000


app.get('/listObjectsV2', async (req, res) => {
  try {
    const minioClient = new Minio.Client({
      endPoint: req.headers.endpoint,
      port: Number(req.headers.port),
      useSSL: false,
      accessKey: req.headers.accesskey,
      secretKey: req.headers.secretkey
    });
        
    const objectStream = minioClient.listObjectsV2(req.headers.bucket, req.headers.prefix, req.headers.recursive == "true")

    const children = []
    for await (const child of objectStream) {
      children.push(child)
    }
  
    res.json(children)
  } catch (e) {
    console.error(e)
    res.status(500).json()
  }
})

app.get('/listBuckets', async (req, res) => {
  try {
    const minioClient = new Minio.Client({
      endPoint: req.headers.endpoint,
      port: Number(req.headers.port),
      useSSL: false,
      accessKey: req.headers.accesskey,
      secretKey: req.headers.secretkey
    });
        
    const buckets = await minioClient.listBuckets()
  
    res.json(buckets)
  } catch (e) {
    console.error(e)
    res.status(500).json()
  }
})

app.post('/putObject', (req, res) => {
  try {
    const minioClient = new Minio.Client({
      endPoint: req.headers.endpoint,
      port: Number(req.headers.port),
      useSSL: false,
      accessKey: req.headers.accesskey,
      secretKey: req.headers.secretkey
    });
        
    minioClient.putObject(req.headers.bucket, req.headers.prefix, req.body || '', () => {
      res.status(201).json()
    })
  
  } catch (e) {
    console.error(e)
    res.status(500).json()
  }
})

app.post('/presignedGetObject', (req, res) => {
  try {
    const minioClient = new Minio.Client({
      endPoint: req.headers.endpoint,
      port: Number(req.headers.port),
      useSSL: false,
      accessKey: req.headers.accesskey,
      secretKey: req.headers.secretkey
    });
        
    minioClient.presignedGetObject(req.headers.bucket, req.headers.path, (_, presignedUrl) => {
      res.status(200).json({presignedUrl})
    })

  } catch (e) {
    console.error(e)
    res.status(500).json()
  }
})

app.post('/presignedPutObject', (req, res) => {
  try {
    const minioClient = new Minio.Client({
      endPoint: req.headers.endpoint,
      port: Number(req.headers.port),
      useSSL: false,
      accessKey: req.headers.accesskey,
      secretKey: req.headers.secretkey
    });
        
    minioClient.presignedPutObject(req.headers.bucket, req.headers.path, (_, presignedUrl) => {
      res.status(200).json({presignedUrl})
    })

  } catch (e) {
    console.error(e)
    res.status(500).json()
  }
})

app.post('/removeObject', (req, res) => {
  try {
    const minioClient = new Minio.Client({
      endPoint: req.headers.endpoint,
      port: Number(req.headers.port),
      useSSL: false,
      accessKey: req.headers.accesskey,
      secretKey: req.headers.secretkey
    })
        
    minioClient.removeObject(req.headers.bucket, req.headers.path, () => {
      res.status(200).json()
    })

  } catch (e) {
    console.error(e)
    res.status(500).json()
  }
})

app.post('/removeObjects', (req, res) => {
  try {
    const minioClient = new Minio.Client({
      endPoint: req.headers.endpoint,
      port: Number(req.headers.port),
      useSSL: false,
      accessKey: req.headers.accesskey,
      secretKey: req.headers.secretkey
    })
        
    minioClient.removeObjects(req.headers.bucket, req.headers.path.split(','), () => {
      res.status(200).json()
    })

  } catch (e) {
    console.error(e)
    res.status(500).json()
  }
})

app.post('/copyObject', (req, res) => {
  try {
    const minioClient = new Minio.Client({
      endPoint: req.headers.endpoint,
      port: Number(req.headers.port),
      useSSL: false,
      accessKey: req.headers.accesskey,
      secretKey: req.headers.secretkey
    })

    const copyConditions = new Minio.CopyConditions()
        
    minioClient.copyObject(req.headers.bucket, req.headers["new-path"], req.headers["old-path"], copyConditions, () => {
      res.status(200).json()
    })

  } catch (e) {
    console.error(e)
    res.status(500).json()
  }
})

app.listen(port, () => {
  console.info(`Minio server listening at http://localhost:${port}`)
})