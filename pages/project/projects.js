import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import ProjectsTable from './projectsTable';
import { useEffect } from 'react';
import {
  Header,
  Icon,
  Button,
  Form,
  Card
} from 'semantic-ui-react';
import MainLayout from '../layouts/layout';

export default () => {
  return (
    <div>
      <link
        rel="stylesheet"
        type="text/css"
        href="semantic/dist/semantic.min.css"
      ></link>
        <MainLayout>
              <Header as="h2">Projeler</Header>
              <ProjectsTable></ProjectsTable>
        </MainLayout>
    </div>
  );
};
