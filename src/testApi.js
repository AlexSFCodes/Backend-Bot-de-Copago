async function test() {
  const response = await fetch('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      symptom: "Me duele mucho el pecho y el brazo izquierdo",
      planId: "plan_oro"
    })
  });
  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));
}
test();
