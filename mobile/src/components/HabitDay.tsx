import { TouchableOpacity, Dimensions } from "react-native";

const WEEK_DAYS = 7;
// 32px de cada lado na horizontal e dividir por 5 porque cada quadrado vai ter
// um espaçamento
const SCREEN_HORIZONTAL_PADDING = (32 * 2) / 5;

export const DAY_MARGIN_BETWEEN = 8;
// o Dimensions pega o tamanho da tela do usuário
// eu vou dividir a largura da tela por quanto dias tem na semana e depois eu
// desconto o valor do padding para descobrir qual o tamanho que permite ter 7
// quadrados na mesma linha
export const DAY_SIZE =
  Dimensions.get("screen").width / WEEK_DAYS - (SCREEN_HORIZONTAL_PADDING + 5);

export function HabitDay() {
  return (
    <TouchableOpacity
      className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800"
      style={{ width: DAY_SIZE, height: DAY_SIZE }}
      activeOpacity={0.7}
    />
  );
}
