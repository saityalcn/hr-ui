import React from 'react';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import jsCookie from 'js-cookie';
import 'semantic-ui-css/semantic.min.css';
import {
  Segment,
  Grid,
  Form,
  Divider,
  Button,
  Card,
  Icon,
  Header,
  PopupContent,
  Message,
} from 'semantic-ui-react';
const description = 'Lütfen Sistem Yöneticinizle İletişime Geçiniz..';
const myfunction = () => {
  console.log('asjkdna');
};

let jsonResponse;
let wrongInfoError = false;
let myHeaders = new Headers({
  'Content-Type': 'application/json',
});

function Home() {
const [isSending, setIsSending] = useState(false);
const router = useRouter();
const sendRequest = useCallback(async (event) => {
  if (isSending) return
  setIsSending(true);
  const email = event.target.email.value;
  const password = event.target.password.value;
  const jsonObject = JSON.stringify({email: email, password: password});
  const response = await fetch('http://localhost:10500/account/log-in', {method: "POST", headers: myHeaders, body:jsonObject});
  jsonResponse = await response.json();
  console.log(jsonResponse);
  if(jsonResponse.isAuthenticated === true){
    jsCookie.set('token', jsonResponse.userId);
    return router.push('/home/home');
  }
  else
    wrongInfoError = true;
  
  setIsSending(false)
}, [isSending]);

  return (
    <div>
      <link
        rel="stylesheet"
        type="text/css"
        href="semantic/dist/semantic.min.css"
      ></link>
      <Segment placeholder>
        <Grid columns={2} relaxed="very" stackable>
          <Grid.Column>
            {wrongInfoError && (
              <Message
                icon="exclamation circle"
                header="Şifre veya E-Posta Yanlış"
                content="Girdiğiniz şifre veya e-posta yanlış. Tekrar deneyiniz"
                error
              />
            )}
            <Form onSubmit={sendRequest}>
              <Form.Input
                icon="mail"
                iconPosition="left"
                name="email"
                label="E-Posta"
                placeholder="E-Posta"
              />
              <Form.Input
                icon="lock"
                iconPosition="left"
                name="password"
                label="Şifre"
                type="password"
              />

              <Button primary loading={isSending} fluid type="submit">
                Giriş
              </Button>
            </Form>
          </Grid.Column>

          <Grid.Column verticalAlign="middle">
            <Card centered>
              <Card.Content header="Kayıt İçin" />
              <Card.Content description={description} />
              <Card.Content extra>
                <Icon name="mail" link onClick={myfunction} />
                {/* maili mavi yap */}
                admin@lorem.com
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid>

        <Divider vertical>VEYA</Divider>
      </Segment>
    </div>
  );
}

export default Home;
