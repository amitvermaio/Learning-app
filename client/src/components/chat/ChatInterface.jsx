import React, { useEffect } from 'react'
import { Send, MessageSquare, Sparkles } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setaichathistory } from '../../store/slices/aiSlice';
import { asyncchatwithdocument, asyncgetchathistory } from '../../store/actions/aiActions';
import MarkdownRenderer from '../common/MarkdownRenderer';
import Spinner from '../common/Spinner';

const ChatInterface = () => {
  const { id } = useParams();
  const user = useSelector((state) => state.auth.user);
  const { chathistory } = useSelector((state) => state.ai);

  const [message, setMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [initialLoading, setInitialLoading] = React.useState(true);
  const messagesEndRef = React.useRef(null);
  const dispatch = useDispatch();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  useEffect(() => {
    setInitialLoading(true);
    const res = dispatch(asyncgetchathistory(id));
    if (res) {
      setInitialLoading(false);
    }
  }, [dispatch, id]);

  return (
    <div>ChatInterface</div>
  )
}

export default ChatInterface