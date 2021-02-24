export default function randomFromInterval(min, max) {
    return Math.random() * (max - min) + min;
}
