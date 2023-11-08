const form = document.forms[0];
const outPutSpan = Array.from(document.querySelectorAll("output span"));

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let shouldReturn = false;
  const [dayElement, monthElement, yearElement] = e.target;
  // check empty
  const dateArr = [dayElement, monthElement, yearElement];
  dateArr.forEach((input, i, inArr) => {
    if (input.value === "") {
      input.setAttribute("data-empty", "true");
      inArr.forEach((input) => {
        input.setAttribute("data-err", "true");
      });
      shouldReturn = true;
    }
  });

  if (shouldReturn) return;

  const day = parseInt(dayElement.value);
  const month = parseInt(monthElement.value) - 1;
  const year = parseInt(yearElement.value);

  if (!isDatePossible(year, month, day)) {
    dateArr.forEach((inp) => {
      inp.setAttribute("data-invalid", "true");
      inp.setAttribute("data-err", "true");
    });
    shouldReturn = true;
  }
  if (shouldReturn) return;
  const age = findAge(day, month, year);
  for (const key in age) {
    if (key < 0) {
      dateArr.forEach((inp) => {
        inp.setAttribute("data-invalid", "true");
        inp.setAttribute("data-err", "true");
      });
      return;
    }
  }
  if (!shouldReturn) {
    outPutSpan[0].innerHTML = `${age.calculated_year}`;
    outPutSpan[1].innerHTML = `${age.calculated_month}`;
    outPutSpan[2].innerHTML = `${age.calculated_date}`;
  }
});

const isLeapYear = (year) => {
  return year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
};

const isDatePossible = (year, month, day) => {
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  return (
    day <= daysInMonth[month] || (isLeapYear(year) && day <= daysInMonth[month])
  );
};

function findAge(birth_date, birth_month, birth_year) {
  // days of every month
  console.log(typeof birth_date);
  const month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const curDate = new Date();
  let [current_date, current_month, current_year] = [
    curDate.getDate(),
    curDate.getMonth(),
    curDate.getFullYear(),
  ];
  if (birth_date > current_date) {
    current_date = current_date + month[birth_month - 1];
    current_month = current_month - 1;
  }

  if (birth_month > current_month) {
    current_year = current_year - 1;
    current_month = current_month + 12;
  }

  // calculate date, month, year
  const calculated_date = current_date - birth_date;
  const calculated_month = current_month - birth_month;
  const calculated_year = current_year - birth_year;

  return { calculated_date, calculated_month, calculated_year };
}
