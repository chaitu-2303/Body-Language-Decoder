from flask import Flask, request, jsonify, render_template
import sqlite3

app = Flask(__name__, static_folder='css')

# Database setup
def init_db():
    conn = sqlite3.connect('actions.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS actions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            action TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

@app.route('/')
def landing():
    return render_template('index.html')

@app.route('/training')
def training():
    return render_template('training.html')

@app.route('/detection')
def detection():
    return render_template('detection.html')

@app.route('/api/actions', methods=['POST'])
def save_action():
    data = request.get_json()
    action = data.get('action')
    
    conn = sqlite3.connect('actions.db')
    cursor = conn.cursor()
    cursor.execute('INSERT INTO actions (action) VALUES (?)', (action,))
    conn.commit()
    conn.close()
    
    return jsonify({'status': 'success', 'action': action}), 201

if __name__ == '__main__':
    init_db()
    app.run(debug=True)
