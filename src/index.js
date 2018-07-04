// @flow

import React, { Component, type Node } from 'react';

type RenderFuncArgs = { restoreScrollPosition: () => void };
type RenderFunc = RenderFuncArgs => Node;
type OnScrollArgs = { scrollBottom: number, scrollTop: number };

export type Props = {
    onScroll: OnScrollArgs => any,
    width: number,
    height: number,
    style: {},
    className?: string,
    children: Node | RenderFunc,
    restoreScrollPositionOnUpdate: boolean
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
        style: {},
        restoreScrollPositionOnUpdate: true
    };

    componentDidMount() {
        this.scrollToBottom();
    }

    componentDidUpdate() {
        if (this.props.restoreScrollPositionOnUpdate) {
            this.restoreScrollPosition();
        }
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

        requestAnimationFrame(() => {
            const height = getHeight(container);
            const scrollTop = container.scrollTop;
            const scrollBottom = container.scrollHeight - height - scrollTop;

            this._currentScrollBottom = scrollBottom;

            this.props.onScroll({ scrollBottom, scrollTop });
        });
    };

    _renderContent() {
        const { children } = this.props;
        if (typeof children === 'function') {
            return children({ restoreScrollPosition: () => this.restoreScrollPosition() });
        }
        return children;
    }

    render() {
        const { height, width, style, children, className } = this.props;

        return (
            <div
                className={className}
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
                    {this._renderContent()}
                </div>
            </div>
        );
    }
}
