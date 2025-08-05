import http from 'k6/http';
import { SharedArray } from 'k6/data';

const data = new SharedArray('jsonlines', () => {
  return open('./InputData.txt')
    .split('\n')
    .filter(l => l.trim())
    .map(l => JSON.parse(l));
});

export let options = { vus: 20, iterations: data.length };

export default function () {

  const idx = __ITER % data.length;
  const item = data[idx];
  const res = http.post('https://restfulapp-service:8080/myApp/postValue', JSON.stringify(item), {
    headers: { 'Content-Type': 'application/json' },
  });
  check(res, { '200 OK': (r) => r.status === 200 });

}