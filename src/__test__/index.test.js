// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import ScrollView from '../index';

describe('ScrollView', () => {
    test('should render without errors', () => {
        const div = document.createElement('div');
        ReactDOM.render(<ScrollView>{() => <div>content</div>}</ScrollView>, div);
    });
});
