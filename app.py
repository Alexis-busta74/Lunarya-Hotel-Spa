from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def inicio():
    return render_template('index.html')

@app.route('/servicios')
def servicios():
    return render_template('servicios.html')

@app.route('/gastronomia')
def gastronomia():
    return render_template('gastronomia.html')

@app.route('/spa')
def spa():
    return render_template('spa.html')

@app.route('/habitaciones')
def habitaciones():
    return render_template('habitaciones.html')

@app.route('/deluxe')
def deluxe():
    return render_template('deluxe.html')

@app.route('/junior-suite')
def junior_suite():
    return render_template('juniorSuite.html')

@app.route('/executive-suite')
def executive_suite():
    return render_template('executiveSuite.html')

@app.route('/contacto')
def contacto():
    return render_template('contacto.html')

@app.route('/reservar')
def reservar():
    return render_template('reservar.html')

if __name__ == '__main__':
    app.run(debug=True)
