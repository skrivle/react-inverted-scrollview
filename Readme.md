[![Build Status](https://travis-ci.org/vejersele/react-inverted-scrollview.svg?branch=master)](https://travis-ci.org/vejersele/react-inverted-scrollview)

# React Inverted ScrollView

Easily support inverted scrolling in for example chat apps. Maintains a correct scroll position when new content is added.

## Installation:

```
npm install react-inverted-scrollview --save
```

## Example:

```javascript
import _ from 'lodash';
import React, { Component } from 'react';
import ScrollView from 'react-inverted-scrollview';

class MyComponent extends Component {
    state = {
        messages: _.range(30).map(index => ({
            id: index,
            text: `message-${index}`
        }))
    };

    scrollToBottom() {
        if (!this.scrollView) return;
        this.scrollView.scrollToBottom();
    }

    scrollToTop() {
        if (!this.scrollView) return;
        this.scrollView.scrollToTop();
    }

    handleScroll = ({ scrollTop, scrollBottom }) => {
        console.log('scrollTop', scrollTop);
        console.log('scrollBottom', scrollBottom);
    };

    render() {
        const { messages } = this.state;
        return (
            <ScrollView
                width={400}
                height={400}
                ref={ref => (this.scrollView = ref)}
                onScroll={this.handleScroll}
            >
                {messages.map(message => <div key={message.id}>{message.text}</div>)}
            </ScrollView>
        );
    }
}
```

## API

### Props

| Prop                          | Type                                                       | Default  |
| ----------------------------- | ---------------------------------------------------------- | -------- |
| width                         | number                                                     | 100      |
| height                        | number                                                     | 100      |
| onScroll                      | (info: { scrollBottom: number, scrollTop: number }) => any | () => {} |
| style                         | Object {}                                                  | {}       |
| restoreScrollPositionOnUpdate | boolean                                                    | true     |
| children                      | React.Node or ({restoreScrollPosition}) => Node            | Node     |

### Instance methods

```javascript
instance.scrollToBottom();
instance.scrollToTop();
instance.setScrollBottom(value);
instance.setScrollTop(value);
instance.restoreScrollPosition();
```

## Check out the examples:

```
git clone https://github.com/vejersele/react-inverted-scrollview.git
cd react-inverted-scrollview
npm install
npm run storybook
```
