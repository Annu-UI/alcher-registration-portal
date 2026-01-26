from django.conf import settings
from django.shortcuts import render, redirect
from users.models import TeamMembers, Team
from competitions.models import Competition, SubmitPerformance, CompTeam
from users.models import NewUser, Price
from django.contrib import messages
from django.contrib.auth.decorators import login_required, permission_required
from django.utils.html import strip_tags
from django.utils.crypto import get_random_string
from itertools import chain
from datetime import date
import uuid
from django.core.mail import EmailMessage 
from django.http import HttpResponse
import io
from django.shortcuts import render
from datetime import date
from django.template.loader import get_template
from rest_framework.decorators import api_view
from django.contrib.admin.views.decorators import staff_member_required
from django.views.decorators.csrf import csrf_exempt

# Home view - requires staff login
@staff_member_required(login_url="/admin/login/")
def home(request):
    return render(request, 'offlinePortal/home.html', {'active_page': 'registration'})

# Search view - requires staff login
@staff_member_required(login_url="/admin/login/")
def search(request):
    if request.method == "POST":
        id = request.POST['alcherID']
        csrf = (request.POST['csrfmiddlewaretoken'])
        print(id)
        if(id != ''):
            if(id[0] == 'A' and NewUser.objects.filter(alcherid=id).first()):
                leader = NewUser.objects.filter(alcherid=id).first()
                team = Team.objects.get(leader=leader)
                context = {
                    'leader': leader,
                    'team': team,
                    'active_page': 'universal_search'
                }
                return render(request, 'offlinePortal/universalSearch.html', context)
            elif(id[0] == 'M' and TeamMembers.objects.filter(memberid=id).first()):
                member = TeamMembers.objects.filter(memberid=id).first()
                team = Team.objects.get(members=member)
                context = {
                    'member': member,
                    'team': team,
                    'id': id,
                    'csrf': csrf,
                    'active_page': 'universal_search'
                }
                return render(request, 'offlinePortal/universalSearch.html', context)
            else:
                messages.error(request, 'Please enter a correct ID')
                return render(request, 'offlinePortal/universalSearch.html', {'active_page': 'universal_search'})
        else:
            messages.error(request, 'Enter ID .')
            return render(request, 'offlinePortal/universalSearch.html', {'active_page': 'universal_search'})

    return render(request, 'offlinePortal/universalSearch.html', {'active_page': 'universal_search'})

# Event-wise search - requires staff login
@staff_member_required(login_url="/admin/login/")
def eventwise_search(request):
    comps = Competition.objects.all()
    if request.method == "POST":
        selection = request.POST['competition']
        competition = Competition.objects.filter(id=selection).first()
        competitions1 = Competition.objects.all().filter(showPeformanceLink=True)
        competitions2 = Competition.objects.all().filter(showPeformanceLink=False)
        if (competition in competitions1):
            submissions = SubmitPerformance.objects.all().filter(event=competition).select_related("team").prefetch_related("team__members")
            if(submissions.count()):
                context = {
                    "competition": competition,
                    "submissions": submissions,
                    'comps': comps,
                }
                return render(request, 'offlinePortal/eventwise_search.html', context)
            else:
                context = {
                    'message': 'No registration for ',
                    'comps': comps,
                    'competition': competition
                }
                return render(request, 'offlinePortal/eventwise_search.html', context)

        elif (competition in competitions2):
            competitions_without_submissions = CompTeam.objects.all().filter(event=competition)
            if(competitions_without_submissions.count()):
                context = {
                    "competition": competition,
                    "comp_wo_sub": competitions_without_submissions,
                    'comps': comps,
                }
                return render(request, 'offlinePortal/eventwise_search.html', context)
            else:
                context = {
                    'message': 'No registration for ',
                    'comps': comps,
                    'competition': competition
                }
                return render(request, 'offlinePortal/eventwise_search.html', context)
        else:
            context = {
                'message': 'No registration for ',
                'comps': comps,
                'competition': competition
            }
            return render(request, 'offlinePortal/eventwise_search.html', context)
    return render(request, 'offlinePortal/eventwise_search.html', {'comps': comps, 'active_page': 'eventwise_search'})

# Event registration - requires staff login
@staff_member_required(login_url="/admin/login/")
def eventRegister(request):
    if request.method == "POST":
        members = request.POST.getlist('member')
        competition = Competition.objects.filter(id=request.POST.get('competition')).first()
        id = request.POST.get('team')
        leader = NewUser.objects.filter(alcherid=id).first()
        team1 = CompTeam.objects.filter(leader=leader).first()
        event = CompTeam(event=competition, leader=leader)
        event.save()
        if competition.showPeformanceLink:
            prev = SubmitPerformance.objects.create(event=competition, team=team1, link=request.POST.get(
                'link'), description=request.POST.get('description'))
            prev.save()
        for member in members:
            event.members.add(TeamMembers.objects.filter(memberid=member).first())
    return render(request, "offlinePortal/eventRegister.html", {"active_page": "event_registration"})

# Search team - requires staff login
@staff_member_required(login_url="/admin/login/")
def searchTeam(request):
    if request.method == "POST":
        id = request.POST.get('alcherid')
        leader = NewUser.objects.filter(alcherid=id).first()
        if leader == None:
            messages.error(request, 'Team Not Found')
            return render(request, "offlinePortal/eventRegister.html", {'active_page': 'event_registration'})
        print(id, leader)
        team = Team.objects.get(leader=leader)
        competitions = Competition.objects.all()
        members = team.members.all()
        print(members)
    return render(request, "offlinePortal/eventRegister.html", {"team": team, "members": members, "competitions": competitions, "id": id, 'active_page': 'event_registration'})

def genINV():
    inv = 'INV-' + get_random_string(length=12)
    return inv

# Room allotment - requires staff login
@staff_member_required(login_url="/admin/login/")
def roomAllotment(request):
    if request.method == "POST":
        # ---------- STEP 1: Handle final submission ----------
        if request.POST.get('accomodation') != '0':
            team_id = request.POST.get('teamId')
            team = Team.objects.filter(id=team_id).first()

            if not team:
                messages.error(request, "Invalid team.")
                return render(request, 'offlinePortal/roomAllot.html', {'active_page': 'accomodation'})

            type1count = type2count = type3count = 0
            type1days = type2days = type3days = 0

            for member in team.members.all():
                acc_key = f"{member.memberid}acc"
                stay_key = f"{member.memberid}stay"
                type_key = f"{member.memberid}acctype"

                if request.POST.get(acc_key) and request.POST.get(acc_key) != '0':
                    member.accommodation = True
                    member.days_stay = int(request.POST.get(stay_key, 0))
                    member.accommodation_type = request.POST.get(type_key, 'none')
                    member.save()

                    if member.accommodation_type == 'type1':
                        type1count += 1
                        type1days += member.days_stay
                    elif member.accommodation_type == 'type2':
                        type2count += 1
                        type2days += member.days_stay
                    elif member.accommodation_type == 'type3':
                        type3count += 1
                        type3days += member.days_stay

            blankets = int(request.POST.get('blankets', 0))
            price = int(request.POST.get('AccomodationPrice', 0))

            team.blankets += blankets
            team.total_paid += price
            team.save()

            context = {
                "team": team,
                "blankets": blankets,
                "total": request.POST.get("total"),
                "accomodation": price,
                "active_page": "accomodation",
                "alcherid": team.leader.alcherid,
                "invno": genINV(),
                "invdate": date.today(),
                "leadername": team.leader.fullname,
                "collegename": team.leader.collegename,
                "phoneno": team.leader.phone_number,
                "type1count": type1count,
                "type2count": type2count,
                "type3count": type3count,
                "type1days": type1days,
                "type2days": type2days,
                "type3days": type3days,
            }

            return render(request, 'offlinePortal/receipt.html', context)

        # ---------- STEP 2: Handle search ----------
        search_id = request.POST.get('alcherID')

        if not search_id:
            messages.error(request, "Enter ID")
            return render(request, 'offlinePortal/roomAllot.html', {'active_page': 'accomodation'})

        if search_id.startswith("ALC"):
            leader = NewUser.objects.filter(alcherid=search_id).first()
            team = Team.objects.filter(leader=leader).first()

        elif search_id.startswith("MEM"):
            member = TeamMembers.objects.filter(memberid=search_id).first()
            team = Team.objects.filter(members=member).first()

        else:
            leader = NewUser.objects.filter(email=search_id).first()
            team = Team.objects.filter(leader=leader).first()

        if not team:
            messages.error(request, "Team not found")
            return render(request, 'offlinePortal/roomAllot.html', {'active_page': 'accomodation'})

        return render(request, 'offlinePortal/roomAllot.html', {
            'team': team,
            'team_members': team.members.all(),
            'active_page': 'accomodation'
        })

    return render(request, 'offlinePortal/roomAllot.html', {'active_page': 'accomodation'})

# Blankets and dues - requires staff login
@staff_member_required(login_url="/admin/login/")
def blankets_dues(request):
    teams = Team.objects.all()
    context = {'teams': teams, 'active_page': 'blankets_dues'}
    return render(request, 'offlinePortal/blankets_dues.html', context)

# Edit blankets and dues - requires staff login
@staff_member_required(login_url="/admin/login/")
def edit_blankets_dues(request):
    id = request.GET.get('team')
    print(request.POST)
    if request.method == 'POST':
        teamid = request.POST['teamid']
        print(request.POST)
        team = Team.objects.get(id=teamid)
        blankets1 = request.POST['blanketUpdate']
        dues1 = request.POST['duesUpdate']
        team.blankets = int(blankets1)
        team.dues = int(dues1)
        team.save()
        context = {'team': team, 'active_page': 'edit_blankets_dues'}
        return render(request, 'offlinePortal/edit_blanketdues.html', context)
    if id:
        context = {'team': '', 'active_page': ''}
        if id[0] == 'A':
            user = NewUser.objects.filter(alcherid=id).first()
            team = Team.objects.get(leader=user)
            context = {'team': team, 'active_page': 'edit_blankets_dues'}
            print(context, user)

        if id[0] == 'M':
            member = TeamMembers.objects.filter(memberid=id)
            teams = Team.objects.get(members__in=member)
            context = {'team': teams, 'active_page': 'edit_blankets_dues'}
        return render(request, 'offlinePortal/edit_blanketdues.html', context)
    return render(request, 'offlinePortal/edit_blanketdues.html', {'active_page': 'edit_blankets_dues'})

def create_new_ref_Number():
    leader_id = "ALC-"
    leader_id += str(Team.objects.count() + 5001) + "-"
    leader_id += get_random_string(length=4)
    if NewUser.objects.filter(alcherid=leader_id).exists():
        return create_new_ref_number()
    if Team.objects.filter(leader_id=leader_id).exists():
        return create_new_ref_Number()
    return leader_id

# Update data - requires staff login
@staff_member_required(login_url="/admin/login/")
def updateData(request):
    if request.method == 'POST':
        try:
            alcher_id = create_new_ref_Number()
            teamLeader = NewUser(fullname=request.POST.get('teamLeaderName'), city=request.POST.get('city'), phone=request.POST.get('teamLeaderContact'),
                                collegename=request.POST.get('college'), email=request.POST.get('teamLeaderEmail'), gender=request.POST.get('teamLeaderGender'), username=get_random_string(length=32), alcherid=alcher_id).save()
            print(teamLeader)

        except Exception as e:
            print(e)

        try:
            member_names = request.POST.getlist('name')
            member_emails = request.POST.getlist('email')
            member_contactNos = request.POST.getlist('phone')
            member_genders = request.POST.getlist('gender')
            members = [TeamMembers(name=member_names[i], email=member_emails[i], phone=member_contactNos[i], gender=member_genders[i], memberid=create_new_ref_number()) for i in range(len(member_names))]
            TeamMembers.objects.bulk_create(members)

            users = NewUser.objects.filter(phone=request.POST.get('teamLeaderContact'))
            if users.exists():
                leader = users.first()
            else:
                print("No matching NewUser object was found")
            team = Team.objects.filter(leader=leader).first()
            team.Accomodation = request.POST.get(' Accomodation')
            team.name = request.POST.get('teamName')
            team.save()
            for i in range(len(member_emails)):
                try:
                    member = TeamMembers.objects.get(email=member_emails[i])
                    print(member_emails)
                except TeamMembers.DoesNotExist:
                    print(f"No matching TeamMembers object was found for email {member_emails[i]}")
                    continue
                team.members.add(member)
                team.save()
            print(leader)

        except Exception as e:
            print(e)

        leader_memeber = TeamMembers.objects.filter(email=request.POST.get('teamLeaderEmail')).first()
        print(leader_memeber)
        leader_memeber.name = request.POST['teamLeaderName']
        leader_memeber.gender = request.POST['teamLeaderGender']
        leader_memeber.save()
        print(alcher_id)
        messages.info(request, f'Your AlcherID is {alcher_id}.')
        return redirect('/offlineportal')

# Save edit data - requires staff login
@staff_member_required(login_url="/admin/login/")
def saveEditData(request):
    if request.method == 'POST':
        alcherid = request.POST.get('hidden_field')
        print(alcherid)

        clgname = request.POST.get('college')
        city = request.POST.get('city')

        name = request.POST.get('teamName')
        newuser = NewUser.objects.filter(alcherid=alcherid).first()

        print(newuser.email)
        team = Team.objects.filter(leader=newuser).first()
        print(team)
        print(alcherid)
        newuser.collegename = clgname
        newuser.city = city
        team.name = name

        print(newuser)
        try:
            newuser.save()
        except Exception as e:
            print(e)
        memdtls = []

        member = Team.objects.get(leader=newuser).members.all()

        for mem in member:
            memdtls.append(TeamMembers.objects.get(email=mem))
        for member in memdtls:
            idname = member.id + "-name"
            name = request.POST.get(idname)

            member.name = name
            email = request.POST.get(member.id + "-email")
            member.email = email
            phone = request.POST.get(member.id + "-phone")
            member.phone = phone
            gender = request.POST.get(member.id + "-gender")
            member.gender = gender

            member.save()

        member_names = request.POST.getlist('name')
        member_emails = request.POST.getlist('email')
        member_contactNos = request.POST.getlist('phone')
        member_genders = request.POST.getlist('gender')

        members = [TeamMembers(name=member_names[i], email=member_emails[i], phone=member_contactNos[i], gender=member_genders[i], memberid=create_new_ref_number()) for i in range(len(member_names))]
        TeamMembers.objects.bulk_create(members)
        users = NewUser.objects.filter(phone=request.POST.get('teamLeaderContact'))
        if users.exists():
            leader = users.first()
        else:
            print("No matching NewUser object was found")

        for i in range(len(member_emails)):
            try:
                member = TeamMembers.objects.get(email=member_emails[i])
                print(member_emails)
            except TeamMembers.DoesNotExist:
                print(f"No matching TeamMembers object was found for email {member_emails[i]}")
                continue
            team.members.add(member)
            team.save()

    return render(request, 'offlinePortal/edit.html')

# Edit data - requires staff login
@staff_member_required(login_url="/admin/login/")
def editData(request):
    query = request.GET.get('edit_id')
    teamLeader = NewUser.objects.filter(alcherid=query).first()
    memdtls = []
    print(teamLeader)
    if teamLeader:
        member = Team.objects.get(leader=teamLeader).members.all()
        print(member)
        team = Team.objects.get(leader=teamLeader)
        for mem in member:
            memdtls.append(TeamMembers.objects.get(email=mem))
            print(memdtls)
        params = {'team': teamLeader, 'memdtls': memdtls, 'mem': team}
        return render(request, 'offlinePortal/saveEdit.html', params)
    return render(request, 'offlinePortal/edit.html')

# Delete user - requires staff login
@staff_member_required(login_url="/admin/login/")
def deleteUser(request, memid):
    print(memid)
    memb = TeamMembers.objects.filter(memberid=memid).first()
    memb.delete()
    return render(request, 'offlinePortal/deleteconfirm.html')

# Save edit - requires staff login
@staff_member_required(login_url="/admin/login/")
def saveEdit(request):
    return render(request, 'offlinePortal/saveEdit.html')

# General search - requires staff login
@staff_member_required(login_url="/admin/login/")
@api_view(['GET', 'POST'])
def general_search(request):
    return render(request, 'offlinePortal/general_search.html')

# All users - requires staff login
@staff_member_required(login_url="/admin/login/")
def all_users(request):
    users = NewUser.objects.all()
    context = {
        "users": users,
        "active_page": "all_users"
    }
    return render(request, "offlinePortal/all_users.html", context)

# All leaders - requires staff login
@staff_member_required(login_url="/admin/login/")
def all_leaders(request):
    teams = Team.objects.select_related("leader").all()
    context = {
        "teams": teams,
        "active_page": "leaders"
    }
    return render(request, "offlinePortal/all_leaders.html", context)

# CSV upload views - requires staff login
@staff_member_required(login_url="/admin/login/")
@csrf_exempt
def pdupdate(request):
    if request.method == "POST":
        csv_file = request.FILES['document']
        file_data = csv_file.read().decode("ISO-8859-1")
        print(file_data)
        a = 1
        csv_data = file_data.split('\n')
        for x in csv_data:
            fields = x.split(',')
            emailid = NewUser.objects.filter(email=fields[2])
            if emailid:
                print(emailid)
                emailid = "same" + str(uuid.uuid4()) + fields[2]
            else:
                emailid = fields[2]
            user = NewUser(alcherid=create_new_ref_Number(), fullname=fields[1], username="pd" + str(a), email=emailid, phone=fields[4], collegename=fields[3], about=fields[5])
            a += 1
            user.save()
            event = Competition.objects.filter().first()
            comp = CompTeam(event=event, leader=user)
            comp.save()
    return render(request, 'offlinePortal/csv_upload.html')

@staff_member_required(login_url="/admin/login/")
def your_view(request):
    current_date = date.today()
    return render(request, 'offlinePortal/roomAllot.html', {'current_date': current_date})

@staff_member_required(login_url="/admin/login/")
def generate_invoice(request):
    email = EmailMessage(
        subject="That's the subject",
        body="That's your message body",
        from_email=settings.EMAIL_HOST_USER,
        to=['sarveshsmurkute@gmail.com']
    )
    email.send()
    return render(request, 'offlinePortal/reciept.html')

@staff_member_required(login_url="/admin/login/")
@csrf_exempt
def vogueupdate(request):
    if request.method == "POST":
        csv_file = request.FILES['document']
        file_data = csv_file.read().decode("ISO-8859-1")

        csv_data = file_data.split('\n')
        y = 0
        for x in csv_data:
            if y == 0:
                y = 1
                continue
            fields = x.split(',')

            emailid = NewUser.objects.filter(email=fields[3])
            if emailid:
                print(emailid)
                emailid = "same" + str(uuid.uuid4()) + fields[3]
            else:
                emailid = fields[3]
            user = NewUser(alcherid=create_new_ref_Number(), fullname=fields[2], username=("vogue" + str(uuid.uuid4())), email=emailid, phone_number=fields[4])
            print(user.username)
            user.save()
            y += 1
            team = Team(name=fields[0], leader=user)
            team.save()
            member = fields[7]
            if member == '\r':
                continue
            else:
                member = fields[7].split('~')

                for z in member:
                    if z == '\r':
                        continue
                    else:
                        mem_data = z.split('|')
                        mem = TeamMembers(memberid=create_new_ref_number(), email=mem_data[1], name=mem_data[0], phone=mem_data[2])
                        mem.save()
                        team.members.add(mem)
                        team.save()
        print(y)

    return render(request, 'offlinePortal/csv_upload.html')

@staff_member_required(login_url="/admin/login/")
@csrf_exempt
def rockoupdate(request):
    if request.method == "POST":
        csv_file = request.FILES['document']
        file_data = csv_file.read().decode("ISO-8859-1")

        csv_data = file_data.split('\n')
        y = 0
        for x in csv_data:
            if y == 0:
                y = 1
                continue
            fields = x.split(',')

            emailid = NewUser.objects.filter(email=fields[7])
            if emailid:
                print(emailid)
                emailid = "same" + str(uuid.uuid4()) + fields[7]
            else:
                emailid = fields[7]
            user = NewUser(alcherid=create_new_ref_Number(), fullname=fields[4], username=("vogue" + str(uuid.uuid4())), email=emailid, phone_number=fields[6])
            print(user.username)
            user.save()
            y += 1
            team = Team(name=fields[0], leader=user)
            team.save()
            member = fields[8]
            if member == '\r':
                continue
            else:
                member = fields[8].split('~')

                for z in member:
                    if z == '\r':
                        continue
                    else:
                        mem_data = z.split('|')

                        mem = TeamMembers(memberid=create_new_ref_number(), email=mem_data[3], name=mem_data[0], phone=mem_data[2])
                        mem.save()
                        team.members.add(mem)
                        team.save()
        print(y)

    return render(request, 'offlinePortal/csv_upload.html')