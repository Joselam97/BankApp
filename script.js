'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jose Alvarez',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2023-11-18T21:31:17.178Z',
    '2024-12-23T07:42:02.383Z',
    '2024-01-28T09:15:04.904Z',
    '2024-04-01T10:17:24.185Z',
    '2024-11-22T14:11:59.604Z',
    '2024-11-20T17:01:17.194Z',
    '2024-12-05T23:36:17.929Z',
    '2024-12-02T10:32:36.790Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account2 = {
  owner: 'Yesenia Morales',
  movements: [5000, 3400.1, -150, -790.99, -3210, -1300.2, 8500, -30.5],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2022-11-01T13:15:33.035Z',
    '2023-11-30T09:48:16.867Z',
    '2023-12-25T06:04:23.907Z',
    '2023-01-25T14:18:46.235Z',
    '2024-11-17T14:11:59.604Z',
    '2024-11-28T17:01:17.194Z',
    '2024-12-02T23:36:17.929Z',
    '2024-12-04T10:32:36.790Z',
  ],
  currency: 'GBP',
  locale: 'en-UK',
};

const account3 = {
  owner: 'Molly Smith',
  movements: [222, -240.5, 345.89, -300.1, -20, 57, 400.99, 460],
  interestRate: 0.7,
  pin: 3333,

  movementsDates: [
    '2024-09-01T13:15:33.035Z',
    '2024-05-30T09:48:16.867Z',
    '2024-04-25T06:04:23.907Z',
    '2024-10-25T14:18:46.235Z',
    '2024-11-25T14:11:59.604Z',
    '2024-11-30T17:01:17.194Z',
    '2024-12-04T23:36:17.929Z',
    '2024-12-02T10:32:36.790Z',
  ],
  currency: 'EUR',
  locale: 'es-ES',
};

const account4 = {
  owner: 'Sarah Williams',
  movements: [-430, 1250.2, 775.5, -50.99, 97, -135.45],
  interestRate: 1,
  pin: 4444,

  movementsDates: [
    '2024-10-18T21:31:17.178Z',
    '2024-10-23T07:42:02.383Z',
    '2024-11-28T09:15:04.904Z',
    '2024-12-01T10:17:24.185Z',
    '2024-12-03T14:11:59.604Z',
    '2024-11-30T17:01:17.194Z',
    '2024-12-02T23:36:17.929Z',
    '2024-12-05T10:32:36.790Z',
  ],
  currency: 'USD',
  locale: 'es-ES',
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');



// Funcion para dar formato a la fecha
const formatMovementDate = function (date, locale) {
  const calcDisplayPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDisplayPassed(new Date(), date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  //const day = `${date.getDate()}`.padStart(2, 0);
  //const month = `${date.getMonth() + 1}`.padStart(2, 0);
  //const year = date.getFullYear();
  //return `${day}/${month}/${year}`;

  //Esto es otra forma
  return new Intl.DateTimeFormat(locale).format(date);
};



//Funcion para formatear currencies
const formatCurr = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};



//Muestra resumen de transacciones
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    //Variable que usa la funcion de dar formato al currency
    const formattedMov = formatCurr(mov, acc.locale, acc.currency);

    //Muestra informacion proveniente de html, pero formateada a cada cuenta
    const html = `
        <div class="movements__row">
            <div class="movements__type movements__type--${type}">
            ${i + 1} ${type}
            </div>
            <div class="movements__date">${displayDate}</div>
            <div class="movements__value">${formattedMov}</div>
        </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};



//Muestra el balance
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = formatCurr(acc.balance, acc.locale, acc.currency);
};



//Muestra el resumen (Income, Outcome, Interest)
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCurr(incomes, acc.locale, acc.currency);

  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCurr(
    Math.abs(outcomes),
    acc.locale,
    acc.currency
  );

  const interests = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCurr(
    interests,
    acc.locale,
    acc.currency
  );
};



//Crea un username con la inicial de nombre y apellido
const createUserNames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUserNames(accounts);



//Funcion que muestra informacion de la cuenta
const updateUI = function (acc) {
  //Muestra transacciones
  displayMovements(acc);
  //Muestra balance
  calcDisplayBalance(acc);
  //Muestra resumen
  calcDisplaySummary(acc);
};



//Manejo de evento con Login
let currentAccount;



//Loggin falso siempre
currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 100;



//Funcion para Login
btnLogin.addEventListener('click', function (e) {
  //evitar un login
  e.preventDefault();
  //Localiza la cuenta que se ingresa
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Muestra mensaje de bienvenida
    labelWelcome.textContent = `Welcome back, 
    ${currentAccount.owner.split(' ')[0]}!`;

    //muestra el estilo css una vez logged
    containerApp.style.opacity = 100;

    // Crea la fecha actual
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      weekday: 'long',
    };

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    //Esta es otra forma de hacerlo

    //const day = `${now.getDate()}`.padStart(2, 0);
    //const month = `${now.getMonth() + 1}`.padStart(2, 0);
    //const year = now.getFullYear();
    //const hour = `${now.getHours()}`.padStart(2, 0);
    //const min = `${now.getMinutes()}`.padStart(2, 0);
    //labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

    //Limpia info del user en text inputs
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    updateUI(currentAccount);
  }
});



//Implementa Transferencias
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    //Hace la transferencia
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //Agrega fecha de transferencia
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    //Actualiza el design
    updateUI(currentAccount);
  }
});



//Solicita Loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {

    //Funcionn para crear un delay de 5s cuando se solicita un Loan
    setTimeout(function () {
      //Agrega movimiento
      currentAccount.movements.push(amount);

      //Agrega fecha al Loan
      currentAccount.movementsDates.push(new Date().toISOString());

      //Restablece estilo
      updateUI(currentAccount);
    }, 5000);
  }
  inputLoanAmount.value = '';
});



//Borrar cuentas
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);

    //Borra la cuenta
    accounts.splice(index, 1);

    //Quita el estilo reflejado de la cuenta
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});



//Funcionalidad para ordenar transacciones
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////

// Currencies
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
