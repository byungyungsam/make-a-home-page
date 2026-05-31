import React from 'react';
import { Cpu, Shield, Zap, Sparkles } from 'lucide-react';

export default function About() {
  const skills = [
    { name: 'C# / .NET', level: 90, type: 'Utility' },
    { name: 'Win32 API', level: 80, type: 'Utility' },
    { name: 'C++ / System', level: 75, type: 'Utility' },
    { name: 'React.js', level: 85, type: 'Web' },
    { name: 'JavaScript (ES6+)', level: 85, type: 'Web' },
    { name: 'HTML5 Canvas', level: 80, type: 'Game' },
    { name: 'UI / UX Design', level: 75, type: 'Design' }
  ];

  const values = [
    {
      icon: <Zap className="value-icon text-cyan" />,
      title: "압도적인 성능 최적화",
      description: "어플리케이션의 메모리 사용량을 최소화하고 연산 속도를 극대화하여 저사양 PC에서도 가볍고 빠르게 동작하도록 설계합니다."
    },
    {
      icon: <Shield className="value-icon text-purple" />,
      title: "안전성과 데이터 보안",
      description: "군사용 규격 영구 삭제 등 개인정보 노출 및 오작동이 없도록 정밀하고 안전한 파괴와 백업 설계를 최우선으로 합니다."
    },
    {
      icon: <Sparkles className="value-icon text-blue" />,
      title: "직관적이고 세련된 UX",
      description: "강력한 성능을 자랑하는 프로그램일지라도 사용하기 간편해야 합니다. 심플하면서도 시각적으로 즐거운 글래스 UI를 지향합니다."
    }
  ];

  return (
    <section id="about" className="about-section">
      {/* Title */}
      <div className="section-title-wrapper">
        <h2 className="section-title">About & Core Philosophy</h2>
        <div className="section-divider" />
      </div>

      <div className="about-grid">
        {/* Left Side: Bio & Philosophy */}
        <div className="about-left">
          <div className="about-bio-panel glass-panel">
            <h3 className="about-bio-title">
              <Cpu className="icon-cyan-inline" /> 시스템 최적화와 가치를 만드는 개발자
            </h3>
            <p className="about-bio-p">
              안녕하세요! 저는 Windows 네이티브 응용 소프트웨어(유틸리티) 개발과 
              동적 웹 기술을 접목하여 가치 있는 소프트웨어를 제작하는 독립 개발자입니다. 
            </p>
            <p className="about-bio-p">
              주로 C#, Win32 API를 활용해 운영체제 단의 리소스를 직접 제어하며 최적화 솔루션을 제공하고 있으며, 
              웹 환경에서는 React와 HTML5 Canvas를 활용하여 부드럽고 풍부한 비주얼의 게임과 웹 애플리케이션을 개발하고 있습니다.
            </p>
          </div>

          <div className="about-values-grid">
            {values.map((val, idx) => (
              <div key={idx} className="value-card glass-panel">
                <div className="value-icon-wrapper">
                  {val.icon}
                </div>
                <h4 className="value-title">{val.title}</h4>
                <p className="value-desc">{val.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Skill Tags with Visual Indicators */}
        <div className="about-right glass-panel">
          <h3 className="skills-title">Core Tech Stack</h3>
          <div className="skills-list">
            {skills.map((skill, idx) => (
              <div key={idx} className="skill-item">
                <div className="skill-info">
                  <span className="skill-name">{skill.name}</span>
                  <span className="skill-level-badge">{skill.level}%</span>
                </div>
                {/* Custom glowing progress bar */}
                <div className="skill-bar-bg">
                  <div 
                    className="skill-bar-fill"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
