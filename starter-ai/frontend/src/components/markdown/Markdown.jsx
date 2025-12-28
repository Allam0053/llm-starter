import React, { memo, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import styles from './Markdown.module.css';

function Markdown({ text }) {
    const MemoizedParagraph = memo(({ className, children, ...props }) =>
        <p className={`${className} ${styles.markdown_paragraph}`} {...props}>{children}</p>
    );

    // Memoize the components to prevent re-creation on each render
    const components = useMemo(() => ({
        code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');

            // Handle both language-specific and generic code blocks
            if (match) {
                return (
                    <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                    >
                        {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                );
            } else if (className) {
                // Handle generic fenced code blocks (without language specifier)
                return (
                    <SyntaxHighlighter
                        style={vscDarkPlus}
                        language="text" // Use plain text highlighting
                        PreTag="div"
                    >
                        {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                );
            } else {
                // Handle inline code
                return (
                    <code className={`${className} ${styles.markdown_code}`} {...props}>
                        {children}
                    </code>
                );
            }
        },
        p: MemoizedParagraph
    }), []);

    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkBreaks]}
            components={components}
        >
            {text}
        </ReactMarkdown>
    );
}

export default memo(Markdown);
