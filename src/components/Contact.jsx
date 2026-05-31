import React, { useState } from 'react';
import { Send, Mail, GitBranch, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setStatus('error');
      return;
    }

    setStatus('sending');

    setTimeout(() => {
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    }, 2000);
  };

  return (
    <section id="contact" className="contact-section">
      {/* Title */}
      <div className="section-title-wrapper">
        <h2 className="section-title">Contact Me</h2>
        <p className="showcase-subtitle">
          질문, 프로젝트 제안, 혹은 단순 의견 교환 등 언제든 환영합니다!
        </p>
        <div className="section-divider" />
      </div>

      <div className="contact-grid">
        {/* Left Side: Contact Info & SNS */}
        <div className="contact-info-col">
          <div className="glass-panel contact-info-panel">
            <h3 className="contact-info-title">소통 및 채널</h3>
            <p className="contact-info-desc">
              아래 폼을 작성해 전송해 주시면 직접 지정하신 이메일로 답변을 전송해 드립니다. 
              또한 깃허브나 디스코드 등 소셜 미디어를 통해서도 활발히 소통하고 있으니 참고해 주세요.
            </p>

            <div className="contact-links">
              <a href="mailto:contact@developer.com" className="contact-link group">
                <div className="contact-link-icon-wrapper">
                  <Mail className="icon-cyan-small" />
                </div>
                <span className="contact-link-text">contact@developer.com</span>
              </a>

              <a href="https://github.com" target="_blank" rel="noreferrer" className="contact-link group">
                <div className="contact-link-icon-wrapper">
                  <GitBranch className="icon-purple-small" />
                </div>
                <span className="contact-link-text">github.com/developer-repo</span>
              </a>

              <div className="contact-link">
                <div className="contact-link-icon-wrapper">
                  <MessageSquare className="icon-blue-small" />
                </div>
                <span className="contact-link-text">Discord: dev_pioneer#1234</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Message Form */}
        <div className="contact-form-col glass-panel">
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-row-2">
              {/* Name */}
              <div className="form-group">
                <label className="form-label">이름 *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="홍길동"
                  required
                  disabled={status === 'sending'}
                  className="form-input"
                />
              </div>
              
              {/* Email */}
              <div className="form-group">
                <label className="form-label">이메일 *</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="gildong@example.com"
                  required
                  disabled={status === 'sending'}
                  className="form-input"
                />
              </div>
            </div>

            {/* Subject */}
            <div className="form-group">
              <label className="form-label">제목</label>
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="제안서 혹은 인사말"
                disabled={status === 'sending'}
                className="form-input"
              />
            </div>

            {/* Message */}
            <div className="form-group">
              <label className="form-label">메시지 내용 *</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="프로젝트 의뢰 및 문의 사항을 입력해 주세요."
                rows={5}
                required
                disabled={status === 'sending'}
                className="form-textarea"
              />
            </div>

            {/* Notifications */}
            {status === 'success' && (
              <div className="alert-success">
                <CheckCircle className="icon-success" />
                <span>성공적으로 전송되었습니다! 곧 남겨주신 이메일로 회신해 드리겠습니다.</span>
              </div>
            )}

            {status === 'error' && (
              <div className="alert-error">
                <AlertCircle className="icon-error" />
                <span>필수 항목(*)을 전부 바르게 입력해 주십시오.</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === 'sending'}
              className="glow-btn btn-submit"
            >
              {status === 'sending' ? (
                <>
                  <div className="spinner" />
                  <span>전송하는 중...</span>
                </>
              ) : (
                <>
                  <Send className="icon-btn-small" />
                  <span>메시지 보내기</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
