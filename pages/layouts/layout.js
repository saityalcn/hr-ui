import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Sidebar, Menu, Icon, Segment, Header, Sticky } from 'semantic-ui-react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const iconColor = "#111111"

var currentUser = {};
const myHeaders = new Headers({
  'Content-Type': 'application/json',
});

export default (props) => {
  const router = useRouter();
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
            style={{ backgroundColor: "#ffffff", height:100 + "%"}}
          >
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
