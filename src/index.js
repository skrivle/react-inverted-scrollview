// @flow

import React, { Component, type Node } from 'react';

export type Props = {
    onScroll: ({ scrollBottom: number, scrollTop: number }) => any,
    width: number,
    height: number,
    style: {},
    children: Node | (({ restoreScrollPosition: () => void }) => Node)
};

const getHeight = (container: HTMLElement) => container.getBoundingClientRect().height;

export default class ScrollView extends Component<Props> {
    _currentScrollBottom: number;
    _scrollContainer: ?HTMLElement;

    _currentScrollBottom = 0;

    static defaultProps = {
        onScroll: () => {},
        width: 100,
        height: 100,
        style: {}
    };

    componentDidMount() {
        this.scrollToBottom();
    }

    componentDidUpdate() {
        this.restoreScrollPosition();
    }

    restoreScrollPosition() {
        this.setScrollBottom(this._currentScrollBottom);
    }

    scrollToTop() {
        this.setScrollTop(0);
    }

    scrollToBottom() {
        this.setScrollBottom(0);
    }

    setScrollBottom(value: number) {
        const container = this._scrollContainer;
        if (!container) return;
        const height = getHeight(container);
        container.scrollTop = container.scrollHeight - height - value;
    }

    setScrollTop(value: number) {
        if (!this._scrollContainer) return;
        this._scrollContainer.scrollTop = value;
    }

    _handleScroll = () => {
        const container = this._scrollContainer;

        if (!container) return;

        const height = getHeight(container);
        const scrollTop = container.scrollTop;
        const scrollBottom = container.scrollHeight - height - scrollTop;

        this._currentScrollBottom = scrollBottom;

        this.props.onScroll({ scrollBottom, scrollTop });
    };

    _renderChildren() {
        const { children } = this.props;
        if (typeof children === 'function') {
            return children({ restoreScrollPosition: () => this.restoreScrollPosition() });
        }
        return children;
    }

    render() {
        const { height, width, style, children } = this.props;

        return (
            <div
                onScroll={this._handleScroll}
                style={{
                    overscrollBehavior: 'contain contain',
                    height: height,
                    width: width,
                    overflowY: 'scroll',
                    ...style
                }}
                ref={ref => (this._scrollContainer = ref)}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: '100%',
                        justifyContent: 'flex-end'
                    }}
                >
                    {this._renderChildren()}
                </div>
            </div>
        );
    }
}
