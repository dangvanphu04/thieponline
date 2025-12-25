# app.py
from flask import Flask, render_template, request, jsonify, send_from_directory
import json
import os
from datetime import datetime

app = Flask(__name__)
guests = []
DATA_FILE = 'data/guests.json'
os.makedirs('data', exist_ok=True)
os.makedirs('static/audio', exist_ok=True)
os.makedirs('static/images/animated', exist_ok=True)

def load_guests():
    global guests
    try:
        if os.path.exists(DATA_FILE):
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                guests = json.load(f)
    except:
        guests = []

def save_guests():
    try:
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(guests, f, indent=2, ensure_ascii=False)
    except Exception as e:
        print(f"Error saving guests: {e}")

@app.route('/')
def index():
    """Trang chính với layout cuối cùng"""
    return render_template('index-final.html')

@app.route('/rsvp', methods=['POST'])
def rsvp():
    try:
        data = request.get_json()
        guests.append(data)
        save_guests()
        return jsonify({
            'success': True,
            'message': 'Cảm ơn bạn đã xác nhận tham dự!'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Có lỗi xảy ra: {str(e)}'
        }), 400

@app.route('/static/audio/<filename>')
def serve_audio(filename):
    return send_from_directory('static/audio', filename)

if __name__ == '__main__':
    load_guests()
    app.run(debug=True, host='0.0.0.0', port=5000)