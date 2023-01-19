import dayjs from "dayjs";

export function generateDatesFromYearBeginning() {
  const firstDayOfTheYear = dayjs().startOf("year");
  const today = new Date();

  const dates = [];
  let compareDate = firstDayOfTheYear;

  // enquanto a data que eu estou utilizando para comparação para cada interação
  // do while for anterior(isBefore) a hoje eu vou continuar fazendo o while
  while (compareDate.isBefore(today)) {
    // vou adicionando um no compareDate em cada interação do while
    dates.push(compareDate.toDate());
    compareDate = compareDate.add(1, "day");
  }

  return dates;
}
