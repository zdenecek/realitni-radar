import { Chart, registerables } from 'chart.js';


export default function chartjs() {
  Chart.register(...registerables);
}
