// IMPORTS
import './style.css'
import IregisterData from './types/interface'
import { API_ULR } from './constants/const';

//agarramos los datos del formulario de registro
const formRegister = document.getElementById('formRegister') as HTMLFormElement;
const username = document.getElementById('username') as HTMLInputElement;
const lastname = document.getElementById('lastname') as HTMLInputElement;
const email = document.getElementById('emailAddressRegister') as HTMLInputElement;
const phone = document.getElementById('phone') as HTMLInputElement;
const password = document.getElementById('passwordRegister') as HTMLInputElement;
const passwordConfirmation = document.getElementById('passwordConfirmation') as HTMLInputElement;
const gender = document.getElementById('gender') as HTMLInputElement;

//agarramos los datos del formulario de login
const formLogin = document.getElementById('formLogin') as HTMLFormElement;
const emailLogin = document.getElementById('emailAddressLogin') as HTMLInputElement;
const passwordLogin = document.getElementById('passwordLogin') as HTMLInputElement;

//mensajes de errores
const errorMsgRegister = document.getElementById('errorMsgRegister') as HTMLDivElement;
const errorMsgLogin = document.getElementById('errorMsgLogin') as HTMLDivElement;

//mensajes de exito
const successMsgRegister = document.getElementById('successMsgRegister') as HTMLDivElement;
const successMsgLogin = document.getElementById('successMsgLogin') as HTMLDivElement;

//spinner
const spinnerLogin = document.getElementById('spinnerLogin') as HTMLDivElement;
const spinnerRegister = document.getElementById('spinnerRegister') as HTMLDivElement;

//funcion para limpiar los campos del formulario
function clearFormFieldsRegister() {
  username.value = '';
  lastname.value = '';
  email.value = '';
  phone.value = '';
  password.value = '';
  passwordConfirmation.value = '';
}

function clearFormFieldsLogin() {
  emailLogin.value = '';
  passwordLogin.value = '';
}

//funcion para el manejo de mensajes
function showMessage(element: HTMLElement, message: string) {
  element.innerText = message;
  setTimeout(() => {
    element.innerText = '';
  }, 2000);
}

function showSpinner(element: HTMLElement) {
  // Mostrar el spinner
  element.classList.remove('hidden');
}

function hideSpinner(element: HTMLElement) {
  // Ocultar el spinner
  element.classList.add('hidden');
}

document.addEventListener('DOMContentLoaded', () => {

if (formRegister) {
  //mandamos los datos del formulario de registro al servidor
  formRegister.addEventListener('submit', async (e) => {
    e.preventDefault();

    showSpinner(spinnerRegister);
  
    const data: IregisterData = {
      username: username.value,
      lastname: lastname.value,
      email: email.value,
      phone: phone.value,
      password: password.value,
      passwordConfirmation: passwordConfirmation.value,
      gender: gender.value
    };
  
    try {
      const res = await fetch(`${API_ULR}/register` , {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

        // Ocultar el spinner después de recibir la respuesta del servidor
        hideSpinner(spinnerRegister);
  
      if (!res.ok) {
        // Si la respuesta no es exitosa, mostramos el mensaje de error
        const messageError = await res.text();
        showMessage(errorMsgRegister, messageError);
  
    
      } else {
        // Si la respuesta es exitosa, continuamos con el procesamiento según sea necesario
        const responseData = await res.json();
        console.log(responseData);
  
        if (responseData.message === 'User registered successfully') {
          // Limpiamos los campos del formulario
          clearFormFieldsRegister()
        
          // Mostramos un mensaje de éxito
          showMessage(successMsgRegister, responseData.message)
   
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  });
  
}

if (formLogin) {
  // mandamos los datos del formulario de login al servidor
  
  formLogin.addEventListener('submit', async (e) => {
      e.preventDefault();

      showSpinner(spinnerLogin)
  
      const data = {
        email: emailLogin.value,
        password: passwordLogin.value
      }
  
      try {

 

        const res = await fetch(`${API_ULR}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(data)
        });
        
        hideSpinner(spinnerLogin)
        if (!res.ok) {
          const messageError = await res.text();
          clearFormFieldsLogin();
          showMessage(errorMsgLogin, messageError);
          return;
        } else {
          const responseData = await res.json();
          console.log(responseData);
  
          if (responseData.message === 'User logged in successfully') {
            // Limpiamos los campos del formulario
            clearFormFieldsLogin();
  
            // Mostramos un mensaje de éxito
            showMessage(successMsgLogin, responseData.message)
          }
        }
      } catch (error) {
        console.error('Error:', error);
      } 
    });
}


});