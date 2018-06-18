// @flow

import _ from 'lodash';
import { storiesOf } from '@storybook/react';
import React, { Component } from 'react';
import ScrollView from '../src/index';

const ImageList = () => (
    <ScrollView
        onScroll={({ scrollTop, scrollBottom }) => {
            console.log('scrollTop', scrollTop);
            console.log('scrollBottom', scrollBottom);
        }}
        height={500}
        width={300}
    >
        {({ restoreScrollPosition }) =>
            _.range(10).map(i => (
                <div key={i}>
                    <img
                        style={{ maxWidth: '100%', display: 'block' }}
                        src={`https://picsum.photos/300/300/?image=${i}`}
                        onLoad={() => restoreScrollPosition()}
                    />
                </div>
            ))
        }
    </ScrollView>
);

storiesOf('ImageList', module).add('ImageList', () => (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
        <ImageList />
    </div>
));
