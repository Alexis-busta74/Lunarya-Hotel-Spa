# app.py - Aplicación Flask para gestión de zapatos

# Importaciones estándar
import click

# Importaciones de Flask y extensiones
from flask import Flask, render_template, redirect, url_for, flash, request
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from flask_bootstrap import Bootstrap
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, TextAreaField, FloatField, IntegerField
from wtforms.validators import DataRequired, Email, Length
from werkzeug.security import generate_password_hash, check_password_hash

# Configuración de la aplicación
app = Flask(__name__)
app.config['SECRET_KEY'] = 'tu_clave_secreta_aqui'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///hotel.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicialización de extensiones
db = SQLAlchemy(app)
Bootstrap(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login' # type: ignore

# =============================================
# Modelos de base de datos
# =============================================
class User(UserMixin, db.Model):
    """Modelo de usuario para autenticación"""
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    is_admin = db.Column(db.Boolean, default=False)

    def set_password(self, password):
        """Genera hash de la contraseña"""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """Verifica la contraseña con el hash almacenado"""
        return check_password_hash(self.password_hash, password)


class Shoe(db.Model):
    """Modelo de producto zapato"""
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Float, nullable=False)
    size = db.Column(db.String(20))
    color = db.Column(db.String(50))
    image_url = db.Column(db.String(200))
    stock = db.Column(db.Integer, default=0)
    
class Contacto(db.Model):
    """Modelo de formulario de contacto"""
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    apellido = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    telefono = db.Column(db.String(50))
    mensaje = db.Column(db.Text, nullable=False)

# =============================================
# Formularios
# =============================================
class LoginForm(FlaskForm):
    """Formulario de inicio de sesión"""
    username = StringField('Usuario', validators=[DataRequired()])
    password = PasswordField('Contraseña', validators=[DataRequired()])
    submit = SubmitField('Iniciar Sesión')


class RegisterForm(FlaskForm):
    """Formulario de registro de usuario"""
    username = StringField('Usuario', validators=[DataRequired(), Length(min=4, max=50)])
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Contraseña', validators=[DataRequired(), Length(min=6)])
    submit = SubmitField('Registrarse')


class ShoeForm(FlaskForm):
    """Formulario para gestión de zapatos"""
    name = StringField('Nombre', validators=[DataRequired()])
    description = TextAreaField('Descripción')
    price = FloatField('Precio', validators=[DataRequired()])
    size = StringField('Talla')
    color = StringField('Color')
    image_url = StringField('URL de la imagen')
    stock = IntegerField('Stock', default=0)
    submit = SubmitField('Guardar')

class ContactoForm(FlaskForm):  # contacto.html hotel # 
    nombre = StringField('Nombre', validators=[DataRequired()])
    apellido = StringField('Apellido', validators=[DataRequired()])
    email = StringField('Email', validators=[DataRequired(), Email()])
    telefono = StringField('Teléfono')
    mensaje = TextAreaField('Mensaje', validators=[DataRequired(), Length(max=300)])
    submit = SubmitField('Enviar mensaje')

# =============================================
# Comandos CLI
# =============================================
@app.cli.command("create-admin")
@click.argument("username")
@click.argument("password")
def create_admin(username, password):
    """Crear un usuario administrador"""
    with app.app_context():
        if User.query.filter_by(username=username).first():
            print("¡El usuario ya existe!")
            return
        
        admin = User(
            username=username, # type: ignore
            email=f"{username}@example.com", # type: ignore
            is_admin=True # type: ignore
        )
        admin.set_password(password)
        db.session.add(admin)
        db.session.commit()
        print(f"Administrador {username} creado!")


# =============================================
# Funciones auxiliares
# =============================================
@login_manager.user_loader
def load_user(user_id: str):
    """Cargar usuario para Flask-Login"""
    return User.query.get(int(user_id))


# Crear tablas de base de datos
with app.app_context():
    db.create_all()


# =============================================
# Rutas de autenticación
# =============================================
@app.route('/login', methods=['GET', 'POST'])
def login():
    """Manejar inicio de sesión"""
    if current_user.is_authenticated:
        return redirect(url_for('shoe_list'))
    
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user and user.check_password(form.password.data):
            login_user(user)
            next_page = request.args.get('next')
            return redirect(next_page or url_for('shoe_list'))
        flash('Usuario o contraseña incorrectos', 'danger')
    return render_template('auth/login.html', form=form)


@app.route('/register', methods=['GET', 'POST'])
def register():
    """Manejar registro de usuarios"""
    if current_user.is_authenticated:
        return redirect(url_for('shoe_list'))
    
    form = RegisterForm()
    if form.validate_on_submit():
        existing_user = User.query.filter_by(username=form.username.data).first()
        existing_email = User.query.filter_by(email=form.email.data).first()
        
        if existing_user:
            flash('El nombre de usuario ya está en uso', 'danger')
        elif existing_email:
            flash('El correo electrónico ya está registrado', 'danger')
        else:
            user = User(
                username=form.username.data, # type: ignore
                email=form.email.data, # type: ignore
                is_admin=False # type: ignore
            )
            user.set_password(form.password.data)
            db.session.add(user)
            db.session.commit()
            flash('Registro exitoso. Ahora puedes iniciar sesión.', 'success')
            return redirect(url_for('login'))
    return render_template('auth/register.html', form=form)


@app.route('/logout')
@login_required
def logout():
    """Manejar cierre de sesión"""
    logout_user()
    return redirect(url_for('shoe_list'))


# =============================================
# Rutas de productos
# =============================================
@app.route('/')
@app.route('/shoes')
def shoe_list():
    """Mostrar lista de zapatos"""
    shoes = Shoe.query.all()
    return render_template('products/list.html', shoes=shoes)


@app.route('/shoes/create', methods=['GET', 'POST'])
@login_required
def shoe_create():
    """Crear nuevo zapato (solo admin)"""
    if not current_user.is_admin:
        flash('No tienes permisos para realizar esta acción', 'danger')
        return redirect(url_for('shoe_list'))
    
    form = ShoeForm()
    if form.validate_on_submit():
        shoe = Shoe(
            name=form.name.data, # type: ignore
            description=form.description.data, # type: ignore
            price=form.price.data, # type: ignore
            size=form.size.data, # type: ignore
            color=form.color.data, # type: ignore
            image_url=form.image_url.data, # type: ignore
            stock=form.stock.data # type: ignore
        )
        db.session.add(shoe)
        db.session.commit()
        flash('Zapato creado exitosamente', 'success')
        return redirect(url_for('shoe_list'))
    return render_template('products/create.html', form=form)


@app.route('/shoes/<int:id>/edit', methods=['GET', 'POST'])
@login_required
def shoe_edit(id: int):
    """Editar zapato existente (solo admin)"""
    if not current_user.is_admin:
        flash('No tienes permisos para realizar esta acción', 'danger')
        return redirect(url_for('shoe_list'))
    
    shoe = Shoe.query.get_or_404(id)
    form = ShoeForm(obj=shoe)
    
    if form.validate_on_submit():
        form.populate_obj(shoe)
        db.session.commit()
        flash('Zapato actualizado exitosamente', 'success')
        return redirect(url_for('shoe_list'))
    return render_template('products/edit.html', form=form, shoe=shoe)


@app.route('/shoes/<int:id>/delete', methods=['POST'])
@login_required
def shoe_delete(id: int):
    """Eliminar zapato (solo admin)"""
    if not current_user.is_admin:
        flash('No tienes permisos para realizar esta acción', 'danger')
        return redirect(url_for('shoe_list'))
    
    shoe = Shoe.query.get_or_404(id)
    db.session.delete(shoe)
    db.session.commit()
    flash('Zapato eliminado exitosamente', 'success')
    return redirect(url_for('shoe_list'))

@app.route('/contacto', methods=['GET', 'POST'])
def contacto():
    """Manejar formulario de contacto"""
    form = ContactoForm()
    if form.validate_on_submit():
        nuevo_contacto = Contacto(
            nombre=form.nombre.data,
            apellido=form.apellido.data,
            email=form.email.data,
            telefono=form.telefono.data,
            mensaje=form.mensaje.data
        )
        db.session.add(nuevo_contacto)
        db.session.commit()
        flash('Mensaje enviado exitosamente. ¡Gracias por contactarnos!', 'success')
        return redirect(url_for('contacto'))

    return render_template('contacto.html', form=form)


# Punto de entrada de la aplicación
if __name__ == '__main__':
    app.run(debug=True)
