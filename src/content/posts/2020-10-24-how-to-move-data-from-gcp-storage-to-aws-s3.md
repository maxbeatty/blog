---
title: "How to move data from GCP Storage to AWS S3"
slug: "2020/10/24/how-to-move-data-from-gcp-storage-to-aws-s3"
date: 2020-10-24
categories:
  - "Personal"
draft: true
---

1. Start an instance
2. gsutil installed (4.53), python3 installed
3. Put AWS credentials in .aws/credentials
4. Edit ~/.boto to include `[s3] use-sigv4=True` and `host=s3.$REGION.amazonaws.com`
5. `AWS_PROFILE=whatever gsutil -m rsync -r gs://my-gcp-source s3://my-aws-destination`
6. `-m` for multithread, `-r` for recursive

gsutil reads from gcp to local and pipes from local to s3. GCP VM instance faster than residential ISP
