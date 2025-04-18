# Medical Devices Management API

![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![Express](https://img.shields.io/badge/Express-4.x-lightgrey)
![MongoDB](https://img.shields.io/badge/MongoDB-7.x-green)
![Redis](https://img.shields.io/badge/Redis-7.x-red)
![JWT](https://img.shields.io/badge/JWT-Auth-blue)

A secure, scalable API for managing medical devices inventory, tracking status, and generating analytics reports in healthcare environments.

## Key Features

- **Device Lifecycle Management**: Track devices from procurement to retirement
- **Real-time Status Monitoring**: Active, maintenance, and calibration statuses
- **Advanced Analytics**: Generate usage reports and maintenance forecasts
- **HIPAA-Compliant Architecture**: Secure access controls and audit logging
- **High Performance**: Redis caching for frequently accessed devices
- **Modular Design**: Easy to extend for new device types and features

## Architecture Overview

```mermaid
graph TD
    A[Client] --> B{API Gateway}
    B --> C[Auth]
    C --> D[Controllers]
    D --> E[Services]
    E --> F[Repositories]
    F --> G[(MongoDB)]
    E --> H[[Redis]]
