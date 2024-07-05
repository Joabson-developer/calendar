const MONTH = [
    {
        abbrev: "Jan",
        fullName: "Janeiro"
    },
    {
        abbrev: "Fev",
        fullName: "Fevereiro"
    },
    {
        abbrev: "Mar",
        fullName: "Março"
    },
    {
        abbrev: "Abr",
        fullName: "Abril"
    },
    {
        abbrev: "Mai",
        fullName: "Maio"
    },
    {
        abbrev: "Jun",
        fullName: "Junho"
    },
    {
        abbrev: "Jul",
        fullName: "Julho"
    },
    {
        abbrev: "Ago",
        fullName: "Agosto"
    },
    {
        abbrev: "Set",
        fullName: "Setembro"
    },
    {
        abbrev: "Out",
        fullName: "Outubro"
    },
    {
        abbrev: "Nov",
        fullName: "Novembro"
    },
    {
        abbrev: "Dez",
        fullName: "Dezembro"
    }
];
const WEEKDAY = [
    {
        abbrev: "Dom",
        fullName: "Domingo"
    },
    {
        abbrev: "Seg",
        fullName: "Segunda-feira"
    },
    {
        abbrev: "Ter",
        fullName: "terça-feira"
    },
    {
        abbrev: "Qua",
        fullName: "quarta-feira"
    },
    {
        abbrev: "Qui",
        fullName: "Domingo"
    },
    {
        abbrev: "Sex",
        fullName: "Sexta-feira"
    },
    {
        abbrev: "Sáb",
        fullName: "Sábado"
    }
];
// TODO: criar um escape para previuos no janeiro e next no dezembro.
export class Calendar {
    _date;
    _MAXIMUN_NUMBER_OF_DAYS_IN_THE_YEAR = 367;
    _elementWrapper;
    constructor({ currentDate = new Date(), elementWrapper = document.body } = {}) {
        this._date = currentDate;
        this._elementWrapper = (typeof elementWrapper === "string"
            ? document.querySelector(elementWrapper)
            : elementWrapper);
        this._actions();
        this._init();
    }
    _actions() {
        document.addEventListener("click", (event) => {
            const target = event.target;
            switch (target.dataset.action) {
                case "previous":
                    this.previous();
                    break;
                case "next":
                    this.next();
                    break;
                case "show-dialog":
                    this._showDialog();
                    break;
                case "close-dialog":
                    this._closeDialog();
                    break;
            }
        });
    }
    _init() {
        const fullYear = this._getYearInMonths(this._getYearInDays());
        const previousMonth = fullYear[this._date.getMonth() - 1] ||
            this._getDecemberOfThePreviousYear();
        const currentMonth = fullYear[this._date.getMonth()];
        const nextMonth = fullYear[this._date.getMonth() + 1] ||
            this._getJanuaryOfTheFollowingYear();
        const firstCurrentDay = currentMonth[0].getDay();
        const lastCurrentDay = currentMonth[currentMonth.length - 1].getDay();
        const filteredPreviousMonth = -firstCurrentDay === 0 ? [] : previousMonth.slice(-firstCurrentDay);
        const filteredNextMonth = nextMonth.slice(0, 7 - (lastCurrentDay + 1));
        const calendar = [
            ...filteredPreviousMonth,
            ...currentMonth,
            ...filteredNextMonth
        ];
        const groupedByWeek = this._groupByWeek(calendar);
        this._buildCalendar(groupedByWeek);
    }
    _getYearInDays() {
        return Array.from({
            length: this._MAXIMUN_NUMBER_OF_DAYS_IN_THE_YEAR
        })
            .map((_, index) => new Date(this._date.getFullYear(), 0, index + 1))
            .filter((date) => date.getFullYear() === this._date.getFullYear());
    }
    _getYearInMonths(fullYear) {
        return fullYear.reduce((accumulator, date) => {
            const month = date.getMonth();
            if (!accumulator[month])
                accumulator[month] = [];
            accumulator[month].push(date);
            return accumulator;
        }, Array.from({ length: 12 }, () => []));
    }
    _buildCalendar(calendar) {
        const table = `
      <div class="table-header">
        <button class="table-header-month" data-action="show-dialog">${MONTH[this._date.getMonth()].fullName} de ${this._date.getFullYear()}</button>

        <div class="table-header-controls">
          <button class="table-header-control table-header-control-left" data-action="previous">
            ⯅
          </button>
          <button class="table-header-control table-header-control-right" data-action="next">
            ⯆
          </button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
          ${Object.values(WEEKDAY)
            .map(({ abbrev }) => `<th>${abbrev.charAt(0)}</th>`)
            .join("\n")}
          </tr>
        </thead>

        <tbody>
            ${calendar
            .map((week) => `
              <tr>
                ${week
            .map((date) => `
                  <td class="${this._date.getMonth() === date.getMonth()
            ? "current-month"
            : ""}${new Date().getDate() === date.getDate() &&
            new Date().getMonth() === date.getMonth()
            ? " today"
            : ""}">
                    ${date.getDate()}
                  </td>
                `)
            .join("\n")}
              </tr>
            `)
            .join("\n")}
        </tbody>
      </table>
    `;
        this._elementWrapper.innerHTML = table;
    }
    _groupByWeek(days) {
        return days.reduce((weeks, day, index) => {
            const weekIndex = Math.floor(index / 7);
            if (!weeks[weekIndex]) {
                weeks[weekIndex] = [];
            }
            weeks[weekIndex].push(day);
            return weeks;
        }, []);
    }
    _getDecemberOfThePreviousYear() {
        return Array.from({ length: 31 }).map((_, index) => new Date(this._date.getFullYear() - 1, 11, index + 1));
    }
    _getJanuaryOfTheFollowingYear() {
        return Array.from({ length: 31 }).map((_, index) => new Date(this._date.getFullYear() + 1, 0, index + 1));
    }
    next() {
        this._date.setMonth(this._date.getMonth() + 1);
        this._init();
    }
    previous() {
        this._date.setMonth(this._date.getMonth() - 1);
        this._init();
    }
    _showDialog() {
        const dialog = document.querySelector(".dialog");
        dialog.showModal();
    }
    _closeDialog() {
        const dialog = document.querySelector(".dialog");
        dialog.close();
    }
}
