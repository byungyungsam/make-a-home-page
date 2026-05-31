import React, { useState } from 'react';
import projectsData from '../data/projects.json';
import { Download, Play, Cpu, Terminal, CheckCircle2, Info } from 'lucide-react';

export default function Showcase() {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);

  const allProjects = [
    ...projectsData.utilities.map(u => ({ ...u, category: 'utility' })),
    ...projectsData.games.map(g => ({ ...g, category: 'game' }))
  ];

  const filteredProjects = activeTab === 'all' 
    ? allProjects 
    : allProjects.filter(p => p.category === activeTab);

  const handlePlayGame = (id) => {
    const element = document.getElementById('minigame');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="showcase" className="showcase-section">
      {/* Title */}
      <div className="section-title-wrapper">
        <h2 className="section-title">Project Showcase</h2>
        <p className="showcase-subtitle">
          개발 및 릴리즈 완료된 고성능 유틸리티 프로그램과 게임 목록입니다.
        </p>
        <div className="section-divider" />
      </div>

      {/* Tabs */}
      <div className="showcase-tabs">
        {['all', 'utility', 'game'].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setSelectedProject(null);
            }}
            className={`showcase-tab ${activeTab === tab ? 'showcase-tab-active' : ''}`}
          >
            {tab === 'all' ? '전체 보기' : tab === 'utility' ? '유틸리티' : '게임'}
          </button>
        ))}
      </div>

      {/* Grid Layout */}
      <div className="showcase-grid">
        {filteredProjects.map((project) => (
          <div key={project.id} className="project-card glass-panel">
            <div className="project-card-glow" />
            
            <div className="project-card-content">
              {/* Header: Title + Category Tag */}
              <div className="project-header">
                <h3 className="project-title">{project.title}</h3>
                <span className={`project-tag ${project.category === 'utility' ? 'tag-utility' : 'tag-game'}`}>
                  {project.category}
                </span>
              </div>

              {/* Version & Date */}
              <div className="project-meta">
                <span>Version: {project.version}</span>
                <span>Released: {project.releaseDate}</span>
                {project.size && <span>Size: {project.size}</span>}
              </div>

              {/* Description */}
              <p className="project-desc">{project.description}</p>
            </div>

            {/* Buttons / CTA */}
            <div className="project-footer">
              <button onClick={() => setSelectedProject(project)} className="btn-details">
                <Info className="icon-blue-small" /> 상세 스펙 & 기능 보기
              </button>

              <div className="project-actions">
                {project.playable ? (
                  <button onClick={() => handlePlayGame(project.id)} className="glow-btn btn-action-small">
                    <Play className="icon-btn-small" /> 즉시 플레이
                  </button>
                ) : (
                  <a href={project.downloadUrl} download className="glow-btn btn-action-small">
                    <Download className="icon-btn-small" /> 다운로드
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Details Dialog Modal */}
      {selectedProject && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel">
            {/* Close Button */}
            <button onClick={() => setSelectedProject(null)} className="modal-close">
              ✕
            </button>

            {/* Title & Badge */}
            <div className="modal-header">
              <div>
                <h3 className="modal-title">{selectedProject.title}</h3>
                <div className="modal-meta">
                  <span>Version: {selectedProject.version}</span>
                  <span>Released: {selectedProject.releaseDate}</span>
                  {selectedProject.size && <span>Size: {selectedProject.size}</span>}
                </div>
              </div>
              <span className={`project-tag ${selectedProject.category === 'utility' ? 'tag-utility' : 'tag-game'}`}>
                {selectedProject.category}
              </span>
            </div>

            {/* Long Description */}
            <div className="modal-section">
              <h4 className="modal-section-title">제품 상세 설명</h4>
              <p className="modal-section-desc">{selectedProject.longDescription}</p>
            </div>

            {/* Features Checklist */}
            <div className="modal-section">
              <h4 className="modal-section-title">주요 기능 및 강점</h4>
              <ul className="features-grid">
                {selectedProject.features.map((feature, i) => (
                  <li key={i} className="feature-item">
                    <CheckCircle2 className="icon-cyan-small flex-shrink" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Controls / Requirements */}
            <div className="specs-grid">
              {selectedProject.controls && (
                <div className="specs-col">
                  <h4 className="specs-col-title">
                    <Terminal className="icon-purple-small" /> 조작 방법 (Controls)
                  </h4>
                  <div className="specs-list">
                    {Object.entries(selectedProject.controls).map(([key, value]) => (
                      <div key={key} className="specs-row">
                        <span className="spec-key">{key}</span>
                        <span className="spec-val">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedProject.requirements && (
                <div className="specs-col">
                  <h4 className="specs-col-title">
                    <Cpu className="icon-cyan-small" /> 시스템 요구 사양
                  </h4>
                  <div className="specs-list">
                    <div className="specs-row">
                      <span className="spec-key-muted">운영체제</span>
                      <span className="spec-val">{selectedProject.requirements.os}</span>
                    </div>
                    <div className="specs-row">
                      <span className="spec-key-muted">프로세서</span>
                      <span className="spec-val">{selectedProject.requirements.cpu}</span>
                    </div>
                    <div className="specs-row">
                      <span className="spec-key-muted">메모리</span>
                      <span className="spec-val">{selectedProject.requirements.ram}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="modal-footer">
              <button onClick={() => setSelectedProject(null)} className="btn-cancel">
                닫기
              </button>
              {selectedProject.playable ? (
                <button
                  onClick={() => {
                    handlePlayGame(selectedProject.id);
                    setSelectedProject(null);
                  }}
                  className="glow-btn btn-submit-game"
                >
                  <Play className="icon-btn-small" /> 게임 시작하기
                </button>
              ) : (
                <a href={selectedProject.downloadUrl} download className="glow-btn btn-submit-game">
                  <Download className="icon-btn-small" /> 지금 다운로드
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
