document.addEventListener('DOMContentLoaded',()=>{const d=window.cvData;if(!d)return;const setTxt=(id,val)=>{const el=document.getElementById(id);if(el)el.innerHTML=val;};setTxt('lbl-contact',d.labels.contact);setTxt('lbl-languages',d.labels.languages);setTxt('lbl-soft',d.labels.softSkills);setTxt('lbl-tech',d.labels.techSkills);setTxt('lbl-profile',d.labels.profile);setTxt('lbl-education',d.labels.education);setTxt('lbl-projects',d.labels.projects);setTxt('lbl-stack',d.labels.stack);setTxt('cv-name',d.basics.name);setTxt('cv-role',d.basics.role);setTxt('cv-summary',d.basics.summary);const imgPath=window.Utils.getSmartPath(d.basics.imageName,'PROFILE');const imgDiv=document.getElementById('cv-image-div');if(imgDiv){imgDiv.style.backgroundImage='none';imgDiv.style.overflow='hidden';imgDiv.innerHTML=`
        <img src="${imgPath}" 
             alt="Profile" 
             style="width: 100%; height: 100%; object-fit: cover; object-position: 40% 42%; transform: scale(1.35);" 
             onerror="window.Utils.handleImgError(this)">
      `;}const contactContainer=document.getElementById('cv-contact-list');if(contactContainer&&d.contact){contactContainer.innerHTML='';const professionalContacts=d.contact.filter((item)=>item.type==='PROFESSIONAL');professionalContacts.forEach((item)=>{const isCopy=item.link==='-';const iconsBase=d.config.iconsPath||'../assets/icons/';const iconName=item.icon.endsWith('.svg')?item.icon:`${item.icon}.svg`;const iconPath=`${iconsBase}${iconName}`;const contentHtml=isCopy?`<span class="contact-link copyable" onclick="window.Utils.copyText('${item.text}', this)">${item.text}</span>`:`<a href="${item.link}" target="_blank" class="contact-link">${item.text}</a>`;contactContainer.innerHTML+=`
    <div class="contact-item">
      <span class="contact-icon" style="-webkit-mask: url('${iconPath}') no-repeat center; -webkit-mask-size: contain; mask: url('${iconPath}') no-repeat center; mask-size: contain; background-color: currentColor; width: 18px; height: 18px; display: inline-block; vertical-align: middle;"></span>
      ${contentHtml}
    </div>`;});}const langContainer=document.getElementById('cv-languages-list');if(langContainer&&d.languages){langContainer.innerHTML='';d.languages.forEach((lang)=>{const label=lang.level||(lang.score>=130?'B1 Level':'');langContainer.innerHTML+=`
          <div class="skill-row" style="margin-bottom: 8px;">
            <div class="skill-txt" style="justify-content: flex-start; gap: 8px;">
              <span style="font-weight:bold;">${lang.name}</span> 
              <span style="opacity:0.7;">— ${label}</span>
            </div>
          </div>`;});}const renderAsText=(items,containerId)=>{const container=document.getElementById(containerId);if(!items||!container)return;container.innerHTML='';items.forEach((skill)=>{const skillName=typeof skill==='object'?skill.name:skill;container.innerHTML+=`
      <div class="skill-row" style="margin-bottom: 5px;">
        <div class="skill-txt" style="justify-content: flex-start;">
          <span>• ${skillName}</span>
        </div>
      </div>`;});};renderAsText(d.skills.soft,'cv-soft-skills');renderAsText(d.skills.hard,'cv-hard-skills');renderAsText(d.skills.tech,'cv-tech-skills');const eduContainer=document.getElementById('cv-education-list');d.education.forEach((edu)=>{eduContainer.innerHTML+=`
      <div class="list-group">
        <div class="li-head">${edu.title} <span style="opacity:0.6; margin-left:5px; font-size:0.9em">${
          edu.date
        }</span></div>
        <div class="li-item">${edu.degree}</div>
        ${edu.desc ? `<div class="li-item">${edu.desc}</div>` : ''}
      </div>`;});const projContainer=document.getElementById('cv-projects-list');d.projects.forEach((proj)=>{projContainer.innerHTML+=`
      <div class="list-group">
        <div class="li-head">
          <span>${proj.title}</span>
          <span style="font-size:0.8em; opacity:0.8; font-weight:400; color:#444;">// ${proj.stack}</span>
        </div>
        <div class="li-item">${proj.desc}</div>
      </div>`;});const softContainer=document.getElementById('cv-software-grid');if(softContainer&&d.software){softContainer.innerHTML='';const iconsBase=d.config.iconsPath||'../assets/icons/';d.software.forEach((soft)=>{const fullPath=`${iconsBase}${soft.icon || soft.name.toLowerCase()}.svg`;softContainer.innerHTML+=`
      <div class="soft-box">
        <img src="${fullPath}" 
             alt="${soft.name}" 
             class="soft-icon local-img" 
             loading="lazy" 
             onerror="this.style.display='none'">
        <span class="soft-name">${soft.name}</span>
      </div>`;});}});