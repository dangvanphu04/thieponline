from flask import Flask, render_template, request, jsonify
from datetime import datetime
import json
import os
from flask import request

app = Flask(__name__)

# Danh sách lời chúc
congratulations = []

# Thêm danh sách khách mời
guests = {}

@app.route('/')
def index():
    # Format current date in Vietnamese
    current_date = datetime.now().strftime("Ngày %d tháng %m năm %Y")
    return render_template('index.html', current_date=current_date)

# API để gửi lời chúc mừng
@app.route('/send_congratulations', methods=['POST'])
def send_congratulations():
    try:
        data = request.json
        
        # Validate required fields
        if not data.get('name') or not data.get('message'):
            return jsonify({
                'success': False,
                'message': 'Vui lòng nhập tên và lời chúc'
            }), 400
        
        # Prepare congratulation data
        congratulation = {
            'id': len(congratulations) + 1,
            'name': data.get('name'),
            'phone': data.get('phone', ''),
            'relationship': data.get('relationship', 'friend'),
            'message': data.get('message'),
            'gift': data.get('gift', 'none'),
            'attendance': data.get('attendance', 'yes'),
            'timestamp': datetime.now().isoformat(),
            'ip_address': request.remote_addr
        }
        
        # Add to list
        congratulations.append(congratulation)
        
        # Also save to guests list if attending
        if data.get('attendance') in ['yes', 'maybe']:
            guests[congratulation['timestamp']] = {
                'name': data.get('name'),
                'phone': data.get('phone', ''),
                'attendance': data.get('attendance'),
                'guests_number': 1,  # Default
                'message': data.get('message'),
                'timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }
        
        # Save to file
        save_data()
        
        return jsonify({
            'success': True,
            'message': 'Cảm ơn bạn đã gửi lời chúc mừng!'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Có lỗi xảy ra: {str(e)}'
        }), 500

# API để lấy danh sách lời chúc
@app.route('/get_wishes')
def get_wishes():
    # Sort by timestamp (newest first)
    sorted_wishes = sorted(congratulations, 
                          key=lambda x: x['timestamp'], 
                          reverse=True)
    
    # Limit to 20 wishes for initial load
    limited_wishes = sorted_wishes[:20]
    
    return jsonify(limited_wishes)

# Load more wishes
@app.route('/get_more_wishes/<int:offset>')
def get_more_wishes(offset):
    sorted_wishes = sorted(congratulations, 
                          key=lambda x: x['timestamp'], 
                          reverse=True)
    
    # Get next batch of wishes
    start = offset
    end = offset + 10
    more_wishes = sorted_wishes[start:end]
    
    return jsonify(more_wishes)

# Save data to files
def save_data():
    data_dir = 'data'
    os.makedirs(data_dir, exist_ok=True)
    
    with open(os.path.join(data_dir, 'congratulations.json'), 'w') as f:
        json.dump(congratulations, f, indent=4, ensure_ascii=False)
    
    with open(os.path.join(data_dir, 'guests.json'), 'w') as f:
        json.dump(guests, f, indent=4, ensure_ascii=False)

# Load data from files
def load_data():
    global congratulations, guests
    
    data_dir = 'data'
    
    congratulations_file = os.path.join(data_dir, 'congratulations.json')
    guests_file = os.path.join(data_dir, 'guests.json')
    
    try:
        if os.path.exists(congratulations_file):
            with open(congratulations_file, 'r') as f:
                congratulations = json.load(f)
    except:
        congratulations = []
    
    try:
        if os.path.exists(guests_file):
            with open(guests_file, 'r') as f:
                guests = json.load(f)
    except:
        guests = {}

# Trang quản lý
@app.route('/admin')
def admin():
    # Calculate statistics
    total_guests = len(guests)
    attending_yes = sum(1 for g in guests.values() if g['attendance'] == 'yes')
    attending_maybe = sum(1 for g in guests.values() if g['attendance'] == 'maybe')
    attending_no = sum(1 for g in guests.values() if g['attendance'] == 'no')
    
    # Get latest congratulations
    latest_wishes = sorted(congratulations, 
                          key=lambda x: x['timestamp'], 
                          reverse=True)[:10]
    
    return render_template('admin.html', 
                         guests=guests,
                         total_guests=total_guests,
                         attending_yes=attending_yes,
                         attending_maybe=attending_maybe,
                         attending_no=attending_no,
                         latest_wishes=latest_wishes)

# API thống kê
@app.route('/api/stats')
def get_stats():
    return jsonify({
        'total_guests': len(guests),
        'attending_yes': sum(1 for g in guests.values() if g['attendance'] == 'yes'),
        'attending_maybe': sum(1 for g in guests.values() if g['attendance'] == 'maybe'),
        'total_wishes': len(congratulations),
        'days_left': calculate_days_left()
    })

def calculate_days_left():
    wedding_date = datetime(2026, 1, 7, 16, 0, 0)
    now = datetime.now()
    time_left = wedding_date - now
    return max(0, time_left.days)

if __name__ == '__main__':
    # Create necessary directories
    os.makedirs('static/images', exist_ok=True)
    os.makedirs('data', exist_ok=True)
    
    # Load existing data
    load_data()
    
    app.run(debug=True, host='0.0.0.0', port=5000)