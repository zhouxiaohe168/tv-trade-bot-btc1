# AI Setup Instructions & WeChat Work Robot Integration

## Overview
This document provides a comprehensive guide to setting up the AI chat application and integrating it with WeChat Work.

## Prerequisites
- Ensure you have Python 3.x installed on your system.
- Install required packages using pip:
  ```bash
  pip install flask wechatpy
  ```

## AI Chat Application Setup
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/zhouxiaohe168/tv-trade-bot-btc1.git
   cd tv-trade-bot-btc1
   ```
2. **Create a Virtual Environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```
3. **Install Dependencies**:
   Make sure you have all necessary libraries installed:
   ```bash
   pip install -r requirements.txt
   ```
4. **Configuration**:
   - Update the `config.json` file with your API keys and settings. 
   - Example:
   ```json
   {
       "api_key": "YOUR_API_KEY",
       "api_secret": "YOUR_API_SECRET"
   }
   ```
 
## WeChat Work Robot Integration
1. **Create WeChat Work App**:
   - Log in to WeChat Work and go to the administration console.
   - Navigate to the Apps section and click on "Add App".
   - Fill in the required information and save.

2. **Obtain API Credentials**:
   - Once the app is created, copy the API credentials provided by WeChat Work.

3. **Configure API in Your Application**:
   - Update your application with the following API details:
     - `App ID`: `<APP_ID>`
     - `App Secret`: `<APP_SECRET>`

4. **Add Webhook**:
   - Configure the webhook URL in the WeChat Work app settings to point to your deployed application.
   
## Start the Application
1. **Run the Application**:
   ```bash
   python app.py
   ```
2. **Access the Application**:
   - Navigate to `http://localhost:5000` in your web browser to access the AI chat application.

## Troubleshooting
- If you encounter any errors, check the log files for detailed messages.
- Ensure all configurations are correct and that your API keys are valid.

## Conclusion
You are now ready to use the AI chat application integrated with WeChat Work! For further assistance, refer to the documentation or contact support.