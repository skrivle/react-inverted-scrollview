// @flow

import React, { Component } from 'react';
import { storiesOf } from '@storybook/react';
import ScrollView from '../src/';
import casual from 'casual-browserify';
import _ from 'lodash';

const generateMessages = amount =>
    _.range(amount).map(() => ({
        id: casual.uuid,
        text: casual.description,
        user: casual.name
    }));

const fetchOlderMessages = () =>
    new Promise(resolve => {
        setTimeout(() => {
            resolve(generateMessages(10));
        }, Math.max(500, Math.round(Math.random() * 2000)));
    });

const Message = ({ message }) => (
    <div style={{ padding: 5, borderBottom: '1px solid #ccc' }}>
        <b>{message.user}</b> : {message.text}
    </div>
);

type State = {
    input: string,
    messages: Array<{ text: string, id: string, user: string }>,
    isLoading: boolean
};

class Chat extends Component<{}, State> {
    input: ?HTMLElement;
    scrollView: ?ScrollView;

    state = {
        input: '',
        messages: generateMessages(10),
        isLoading: false
    };

    componentDidMount() {
        if (!this.input) return;
        this.input.focus();
    }

    handleSubmit = e => {
        e.preventDefault();

        if (this.state.input === '') return;

        this.setState(
            state => ({
                messages: [...state.messages, { text: state.input, id: casual.uuid, user: 'me' }],
                input: ''
            }),
            () => {
                this.scrollToBottom();
            }
        );
    };

    scrollToBottom() {
        if (!this.scrollView) return;
        this.scrollView.scrollToBottom();
    }

    handleScroll = ({ scrollTop, scrollBottom }) => {
        const { isLoading } = this.state;

        if (isLoading || scrollTop > 100) return;

        this.setState({ isLoading: true });

        fetchOlderMessages().then(olderMessages => {
            this.setState(({ messages }) => ({
                isLoading: false,
                messages: [...olderMessages, ...messages]
            }));
        });
    };

    render() {
        const { messages, input, isLoading } = this.state;

        return (
            <div style={{ border: '1px solid' }}>
                <ScrollView
                    onScroll={this.handleScroll}
                    ref={ref => (this.scrollView = ref)}
                    height={300}
                    width={300}
                >
                    {isLoading ? (
                        <div style={{ background: '#ccc', padding: 5, textAlign: 'center' }}>
                            Loading ...
                        </div>
                    ) : null}
                    <div>
                        {messages.map(message => <Message key={message.id} message={message} />)}
                    </div>
                </ScrollView>
                <div style={{ borderTop: '1px solid' }}>
                    <form onSubmit={this.handleSubmit}>
                        <input
                            value={input}
                            onChange={e => this.setState({ input: e.target.value })}
                            ref={ref => (this.input = ref)}
                            style={{ width: '100%', boxSizing: 'border-box', padding: 5 }}
                        />
                    </form>
                </div>
            </div>
        );
    }
}

storiesOf('Chat', module).add('Chat', () => (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Chat />
    </div>
));
