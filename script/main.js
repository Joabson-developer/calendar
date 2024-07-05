const MONTH = [
    {
        abbrev: "Jan",
        full: "Janeiro"
    },
    {
        abbrev: "Fev",
        full: "Fevereiro"
    },
    {
        abbrev: "Mar",
        full: "Março"
    },
    {
        abbrev: "Abr",
        full: "Abril"
    },
    {
        abbrev: "Mai",
        full: "Maio"
    },
    {
        abbrev: "Jun",
        full: "Junho"
    },
    {
        abbrev: "Jul",
        full: "Julho"
    },
    {
        abbrev: "Ago",
        full: "Agosto"
    },
    {
        abbrev: "Set",
        full: "Setembro"
    },
    {
        abbrev: "Out",
        full: "Outubro"
    },
    {
        abbrev: "Nov",
        full: "Novembro"
    },
    {
        abbrev: "Dez",
        full: "Dezembro"
    }
];
const WEEKDAY = [
    {
        abbrev: "Dom",
        full: "Domingo"
    },
    {
        abbrev: "Seg",
        full: "Segunda-feira"
    },
    {
        abbrev: "Ter",
        full: "terça-feira"
    },
    {
        abbrev: "Qua",
        full: "quarta-feira"
    },
    {
        abbrev: "Qui",
        full: "Domingo"
    },
    {
        abbrev: "Sex",
        full: "Sexta-feira"
    },
    {
        abbrev: "Sáb",
        full: "Sábado"
    }
];
// TODO: criar um escape para previuos no janeiro e next no dezembro.
class Calendar {
    _date;
    _MAXIMUN_NUMBER_OF_DAYS_IN_THE_YEAR = 367;
    constructor(currentDate = new Date()) {
        this._date = currentDate;
        this._init();
    }
    _init() {
        const fullYear = this._getYearInMonths(this._getYearInDays());
        const previousMonth = fullYear[this._date.getMonth() - 1];
        const currentMonth = fullYear[this._date.getMonth()];
        const nextMonth = fullYear[this._date.getMonth() + 1];
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
        document.body.innerHTML = table;
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
    nextMonth() {
        this._date.setMonth(this._date.getMonth() + 1);
        this._init();
    }
    previousMonth() {
        this._date.setMonth(this._date.getMonth() - 1);
        this._init();
    }
}
const calendar = new Calendar();
