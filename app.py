from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import sqlite3
import os

app = Flask(__name__)
CORS(app)

# Crear la base de datos si no existe
DB_NAME = 'contactos.db'

def crear_base_datos():
    with sqlite3.connect(DB_NAME) as conn:
        cursor = conn.cursor()
        # Tabla contacto
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS contacto (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                apellido TEXT NOT NULL,
                email TEXT NOT NULL,
                telefono TEXT,
                mensaje TEXT NOT NULL
            )
        ''')
        # Tabla reserva
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS reserva (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                apellido TEXT NOT NULL,
                email TEXT NOT NULL,
                telefono TEXT,
                fecha_ingreso TEXT NOT NULL,
                fecha_egreso TEXT NOT NULL,
                habitaciones TEXT NOT NULL
            )
        ''')
        conn.commit()


crear_base_datos()

# Ruta para mostrar el HTML
@app.route('/')
def inicio():
    return render_template('index.html')

@app.route('/servicios')
def servicios():
    return render_template('servicios.html')

@app.route('/habitaciones')
def habitaciones():
    return render_template('habitaciones.html')

@app.route('/contacto')
def contacto():
    return render_template('contacto.html')

@app.route('/gracias')
def gracias():
    return render_template('gracias.html')

@app.route('/reservar')
def reservar():
    return render_template('reservar.html')

@app.route('/mensaje_reserva')
def mensaje_reservar():
    return render_template('mensaje_reserva.html')




    
# API para recibir datos del formulario CONTACTO.HTML
@app.route('/api/contacto', methods=['POST'])
def guardar_contacto():
    data = request.get_json()

    nombre = data.get('nombre')
    apellido = data.get('apellido')
    email = data.get('email')
    telefono = data.get('telefono')
    mensaje = data.get('mensaje')

    if not (nombre and apellido and email and mensaje):
        return jsonify({'error': 'Faltan datos obligatorios'}), 400

    with sqlite3.connect(DB_NAME) as conn:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO contacto (nombre, apellido, email, telefono, mensaje)
            VALUES (?, ?, ?, ?, ?)
        ''', (nombre, apellido, email, telefono, mensaje))
        conn.commit()

    return jsonify({'mensaje': 'Contacto guardado correctamente'}), 200

# API para recibir datos del formulario RESRVAR.HTML

@app.route('/api/reserva', methods=['POST'])
def guardar_reserva():
    data = request.get_json()

    nombre = data.get('nombre')
    apellido = data.get('apellido')
    email = data.get('email')
    telefono = data.get('telefono')
    fecha_ingreso = data.get('fecha_ingreso')
    fecha_egreso = data.get('fecha_egreso')
    habitaciones = data.get('habitaciones')  # será un string JSON con los datos

    if not (nombre and apellido and email and fecha_ingreso and fecha_egreso and habitaciones):
        return jsonify({'error': 'Faltan datos obligatorios'}), 400

    with sqlite3.connect(DB_NAME) as conn:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO reserva (nombre, apellido, email, telefono, fecha_ingreso, fecha_egreso, habitaciones)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (nombre, apellido, email, telefono, fecha_ingreso, fecha_egreso, habitaciones))
        conn.commit()

    return jsonify({'mensaje': 'Reserva guardada correctamente'}), 200


# Iniciar servidor
if __name__ == '__main__':
    app.run(debug=True)