import { useStore } from '@nanostores/react';
import { ClientOnly } from 'remix-utils/client-only';
import { chatStore } from '~/lib/stores/chat';
import { classNames } from '~/utils/classNames';
import { HeaderActionButtons } from './HeaderActionButtons.client';
import { ChatDescription } from '~/lib/persistence/ChatDescription.client';
import { useState } from 'react';

export function Header() {
  const chat = useStore(chatStore);
  const [copied, setCopied] = useState(false);

  const handleCopyCA = () => {
    const caText = 'ruaNq1dgrkNdeCJXYYqRfha9UkAskX8f3NPjDKrpump';
    navigator.clipboard
      .writeText(caText)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => console.error('Failed to copy text: ', err));
  };

  return (
    <header
      className={classNames('flex items-center p-5 border-b h-[var(--header-height)]', {
        'border-transparent': !chat.started,
        'border-bolt-elements-borderColor': chat.started,
      })}
    >
      <div className="flex items-center gap-2 z-logo text-bolt-elements-textPrimary cursor-pointer">
        <div className="i-ph:sidebar-simple-duotone text-xl" />
        <a href="/" className="text-2xl font-semibold text-accent flex items-center">
          {/* <span className="i-bolt:logo-text?mask w-[46px] inline-block" /> */}
          <img src="/spark-logo-light-styled.png" alt="logo" className="w-[90px] inline-block dark:hidden" />
          <img src="/spark-logo-dark-styled.png" alt="logo" className="w-[90px] inline-block hidden dark:block" />
        </a>
      </div>
      {chat.started ? (
        <>
          <span className="flex-1 px-4 truncate text-center text-bolt-elements-textPrimary">
            <ClientOnly>{() => <ChatDescription />}</ClientOnly>
          </span>
          <ClientOnly>
            {() => (
              <div className="mr-1">
                <HeaderActionButtons />
              </div>
            )}
          </ClientOnly>
        </>
      ) : (
        <div className="flex-1"></div> // Empty div to push social icons to the right when chat hasn't started
      )}

      {/* Position the CA box in the center */}
      <div className="flex-1 flex justify-center items-center">
        {/* CA Box */}
        <div className="flex items-center bg-transparent rounded-md border-2 border-green-500 px-4 py-2 w-[400px] sm:w-[500px] relative group">
          <span className="text-white text-sm font-medium mr-2">CA:</span>
          <div
            className="text-gray-300 text-sm w-[calc(100%-30px)] cursor-pointer pr-7 whitespace-nowrap"
            onClick={handleCopyCA}
          >
            ruaNq1dgrkNdeCJXYYqRfha9UkAskX8f3NPjDKrpump
          </div>

          {/* Copy button */}
          <div
            className="absolute right-4 text-gray-400 hover:text-green-400 cursor-pointer"
            onClick={handleCopyCA}
            title="Copy to clipboard"
          >
            {copied ? (
              <div className="i-ph:check-circle-duotone w-5 h-5 text-green-500" />
            ) : (
              <div className="i-ph:copy-duotone w-5 h-5" />
            )}
          </div>

          {/* Copy feedback tooltip */}
          {copied && (
            <div className="absolute -top-8 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg">
              Copied!
            </div>
          )}
        </div>
      </div>

      {/* Social Links */}
      <div className="flex items-center gap-4 ml-3 mr-2">
        {/* Get $SPARK Button */}
        <a
          href="https://pump.fun/coin/ruaNq1dgrkNdeCJXYYqRfha9UkAskX8f3NPjDKrpump"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center px-5 py-2 rounded-full 
            bg-green-500 hover:bg-green-600 text-black font-medium text-sm 
            shadow-[0_0_15px_rgba(16,185,129,0.7)] hover:shadow-[0_0_20px_rgba(16,185,129,0.9)]
            border border-green-400
            transition-all duration-300 animate-pulse-subtle"
          title="Get $SPARK"
          style={{
            textShadow: '0 0 5px rgba(0,0,0,0.2)',
            animationDuration: '3s',
          }}
        >
          Get $SPARK
        </a>

        <a
          href="https://x.com/SparkAI_Dev"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center p-2 rounded-md bg-gray-800 hover:bg-green-700 border border-transparent hover:border-bolt-elements-borderColorActive text-bolt-elements-textSecondary hover:text-white transition-all"
          title="Twitter"
        >
          <img
            src="https://cdn.simpleicons.org/x/white"
            alt="Twitter"
            className="w-6 h-6"
            width="24"
            height="24"
            crossOrigin="anonymous"
          />
        </a>
        <a
          href="https://docs.sparkai.digital/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center px-3 py-2 rounded-md bg-gray-800 hover:bg-green-700 border border-transparent hover:border-bolt-elements-borderColorActive text-bolt-elements-textSecondary hover:text-white transition-all"
          title="Documentation"
        >
          <div className="flex items-center gap-2">
            <div className="i-ph:files-duotone w-5 h-5 text-white" />
            <span className="text-white text-sm font-medium">Docs</span>
          </div>
        </a>
      </div>
    </header>
  );
}
