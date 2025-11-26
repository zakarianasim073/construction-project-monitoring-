
import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import MasterControl from './components/MasterControl';
import SiteExecution from './components/SiteExecution';
import FinancialControl from './components/FinancialControl';
import LiabilityTracker from './components/LiabilityTracker';
import DocumentManager from './components/DocumentManager';
import ProjectList from './components/ProjectList';
import { MOCK_PROJECTS } from './constants';
import { ProjectState, ProjectDocument, DPR, UserRole } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [projects, setProjects] = useState<ProjectState[]>(MOCK_PROJECTS);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('DIRECTOR');

  const activeProject = projects.find(p => p.id === activeProjectId);

  const handleCreateProject = (newProject: Partial<ProjectState>) => {
    const project: ProjectState = {
      ...newProject as ProjectState,
      id: `P${Date.now()}`,
    };
    setProjects([project, ...projects]);
    setActiveProjectId(project.id);
  };

  const handleUpdateProject = (projectId: string, updater: (proj: ProjectState) => ProjectState) => {
    setProjects(prevProjects => prevProjects.map(p => {
      if (p.id === projectId) {
        return updater(p);
      }
      return p;
    }));
  };

  const handleAddDocument = (newDoc: ProjectDocument) => {
    if (!activeProjectId) return;
    handleUpdateProject(activeProjectId, (project) => ({
      ...project,
      documents: [newDoc, ...project.documents]
    }));
  };

  const handleAddDPR = (newDPR: DPR) => {
    if (!activeProjectId) return;
    handleUpdateProject(activeProjectId, (project) => {
      // 1. Add DPR
      const updatedDPRs = [newDPR, ...project.dprs];
      
      // 2. Update BOQ Executed Qty if linked
      let updatedBOQ = project.boq;
      if (newDPR.linkedBoqId && newDPR.workDoneQty) {
        updatedBOQ = project.boq.map(item => {
          if (item.id === newDPR.linkedBoqId) {
            return {
              ...item,
              executedQty: item.executedQty + (newDPR.workDoneQty || 0)
            };
          }
          return item;
        });
      }

      return {
        ...project,
        dprs: updatedDPRs,
        boq: updatedBOQ
      };
    });
  };

  if (!activeProject) {
    return (
      <div className="min-h-screen bg-slate-50">
        <ProjectList 
          projects={projects} 
          onSelectProject={setActiveProjectId} 
          onCreateProject={handleCreateProject}
          userRole={userRole}
          onSwitchRole={setUserRole}
        />
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard data={activeProject} />;
      case 'master':
        return <MasterControl data={activeProject} onAddDocument={handleAddDocument} userRole={userRole} />;
      case 'site':
        return <SiteExecution data={activeProject} onAddDocument={handleAddDocument} onAddDPR={handleAddDPR} userRole={userRole} />;
      case 'finance':
        return <FinancialControl data={activeProject} onAddDocument={handleAddDocument} userRole={userRole} />;
      case 'liability':
        return <LiabilityTracker data={activeProject} onAddDocument={handleAddDocument} userRole={userRole} />;
      case 'documents':
        return (
          <div className="h-[calc(100vh-8rem)]">
            <DocumentManager 
              documents={activeProject.documents} 
              onAddDocument={handleAddDocument} 
              allowUpload={userRole === 'DIRECTOR' || userRole === 'MANAGER' || userRole === 'ENGINEER'}
            />
          </div>
        );
      default:
        return <Dashboard data={activeProject} />;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      onSwitchProject={() => setActiveProjectId(null)}
      projectName={activeProject.name}
      userRole={userRole}
      onSwitchRole={setUserRole}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
