import React, { useState } from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Sidebar, Menu, Icon, Segment, Header, Sticky } from 'semantic-ui-react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import jsCookie from 'js-cookie';

const iconColor = "#111111"


export default (props) => {
  const [currentUserName, setCurrentUserName] = useState(null)
  const router = useRouter();
  const name = jsCookie.get('name');
  const surname = jsCookie.get("surname");

  useEffect(() => {
    setCurrentUserName(name + " " + surname);
  }, [])

  return (
    <div style={{height: 100 + 'vh'}}>
        <Sidebar.Pushable
          as={Segment}
          style={{ backgroundColor: "#ffffff", margin: '0'}}
        >
          <Sidebar
            as={Menu}
            animation="push"
            direction="left"
            icon="labeled"
            inverted
            vertical
            visible
            width="thin"
            style={{ backgroundColor: "#ffffff", }}
          >
            <div style={{display: "flex", justifyContent: "space-between", flexDirection: "column", height: 100 + "%"}}>
              <div>
              <Menu.Item
                as="a"
                style={{ color: iconColor }}
                onClick={() => {
                  router.push('/home/home');
                }}
              >
                <Icon name="home" />
                Ana Sayfa
              </Menu.Item>
              <Menu.Item
                as="a"
                style={{ color: iconColor }}
                onClick={() => {
                  router.push('/project/projects');
                }}>
                <Icon name="keyboard" />
                Projeler
              </Menu.Item>
              <Menu.Item
                as="a"
                style={{ color: iconColor }}
                onClick={() => {
                  router.push('/employee/employees');
                }}
              >
                <Icon name="id badge" />
                Çalışanlar
              </Menu.Item>
            </div>
            
            <div>
            <Menu.Item
              as="a"
              onClick={() => {
                jsCookie.remove("email")
                jsCookie.remove("name")
                jsCookie.remove("surname")
                router.push('/');
              }}
              style={{ color: iconColor }}><div style={{paddingBottom: 10+"px"}}>{currentUserName}</div><Icon name="sign-out" /></Menu.Item>
              </div>
            </div>
          </Sidebar>
          <Sidebar.Pusher>
            <Segment basic style={{ paddingRight: '170px', minHeight:"500px"}}>
              {props.children}
            </Segment>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
    </div>
  );
};
